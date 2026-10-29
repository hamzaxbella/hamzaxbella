"""A shared Connect Four board. Python standard library only."""
import copy
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
START, END = '<!-- GAME:START -->', '<!-- GAME:END -->'
REPO = 'hamzaxbella/hamzaxbella'
PATTERN = re.compile(r'play\|([1-9][0-9]{0,6})\|([0-9]{1,2})\|([1-7]|new)')


def fresh(number=1):
    return dict(number=number, board=[[0]*7 for _ in range(6)], turn=0,
                winner=0, finished=False, last=None, processed=[])


def won(board, player):
    for y in range(6):
        for x in range(7):
            for dx, dy in ((1, 0), (0, 1), (1, 1), (1, -1)):
                if all(0 <= x+i*dx < 7 and 0 <= y+i*dy < 6 and
                       board[y+i*dy][x+i*dx] == player for i in range(4)):
                    return True
    return False


def move(state, title, actor, issue):
    result = copy.deepcopy(state)
    if issue in state['processed']:
        return result, 'Already processed'
    match = PATTERN.fullmatch(title)
    if not match:
        return result, 'Malformed command'
    number, turn, column = match.groups()
    if (int(number), int(turn)) != (state['number'], state['turn']):
        return result, 'Board changed; refresh the profile'
    if column == 'new':
        if not state['finished']:
            return result, 'Finish this game first'
        result = fresh(state['number'] + 1)
        result['processed'] = (state['processed'] + [issue])[-200:]
        return result, 'New game'
    if state['finished']:
        return result, 'Game finished'
    x = int(column) - 1
    y = next((y for y in range(5, -1, -1) if not result['board'][y][x]), None)
    if y is None:
        return result, 'Column full'
    player = 1 + state['turn'] % 2
    result['board'][y][x] = player
    result['turn'] += 1
    result['winner'] = player if won(result['board'], player) else 0
    result['finished'] = bool(result['winner'] or result['turn'] == 42)
    result['last'] = dict(actor=actor, column=x+1, player=player, issue=issue)
    result['processed'] = (state['processed'] + [issue])[-200:]
    return result, 'Move accepted'


def link(state, column):
    query = urllib.parse.urlencode(dict(
        title=f"play|{state['number']}|{state['turn']}|{column}",
        body='Submit this issue without changing the title to play. '
             'GitHub Actions updates the shared board, then closes the issue. '
             'Refresh the profile after the workflow finishes. '
             'If someone moves first, refresh and choose again.'))
    return f'https://github.com/{REPO}/issues/new?{query}'


def render(state):
    discs = ['⚪', '🔴', '🟡']
    if state['finished']:
        status = f"{discs[state['winner']]} wins." if state['winner'] else 'A draw. Well played.'
        status += f" [Start the next game →]({link(state, 'new')})"
    else:
        status = f"**{discs[1 + state['turn'] % 2]} Your move.** Pick a column."
    cols = [str(i) if state['finished'] or state['board'][0][i-1]
            else f'[{i} ↓]({link(state, i)})' for i in range(1, 8)]
    lines = [START, '## One more game?', '',
             'One board, everyone who visits. Connect four. Leave the next move to a stranger.',
             '', status, '', '| ' + ' | '.join(cols) + ' |',
             '| ' + ' | '.join([':---:']*7) + ' |']
    lines += ['| ' + ' | '.join(discs[v] for v in row) + ' |' for row in state['board']]
    lines += ['', f"Game {state['number']} · {state['turn']} move{'s' if state['turn'] != 1 else ''}"]
    if state['last']:
        last = state['last']
        # A GitHub login is data, never arbitrary Markdown.
        actor = last['actor'] if re.fullmatch(r'[A-Za-z0-9-]{1,39}', last['actor']) else 'a visitor'
        lines[-1] += f" · Last move: {actor}, column {last['column']}"
    lines += ['', '<sub>Click a number → submit the prefilled issue → refresh after the workflow finishes. '
              'GitHub sign-in required. [Rules & how it works](game/README.md).</sub>', END]
    return '\n'.join(lines)


def update_readme(state):
    path = ROOT / 'README.md'
    content = path.read_text()
    if content.count(START) != 1 or content.count(END) != 1:
        raise ValueError('Expected exactly one game block')
    before, after = content.split(START)[0], content.split(END)[1]
    path.write_text(before + render(state) + after)


def api(path, method='GET', data=None):
    request = urllib.request.Request(
        f'https://api.github.com/repos/{REPO}/{path}', method=method,
        data=json.dumps(data).encode() if data is not None else None,
        headers={'Authorization': 'Bearer ' + os.environ['GH_TOKEN'],
                 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def run():
    if os.environ.get('GITHUB_REPOSITORY') != REPO:
        raise RuntimeError('Repository mismatch')
    state_path = ROOT / 'game/state.json'
    state = json.loads(state_path.read_text())
    pending = []
    page = 1
    while True:
        batch = api(f'issues?state=open&sort=created&direction=asc&per_page=100&page={page}')
        pending.extend(i for i in batch if 'pull_request' not in i and i['title'].startswith('play|'))
        if len(batch) < 100:
            break
        page += 1
    outcomes = []
    for issue in sorted(pending, key=lambda i: i['number']):
        state, outcome = move(state, issue['title'], issue['user']['login'], issue['number'])
        outcomes.append((issue['number'], outcome))
    state_path.write_text(json.dumps(state, indent=2) + '\n')
    update_readme(state)
    subprocess.run(['git', 'add', 'README.md', 'game/state.json'], cwd=ROOT, check=True)
    changed = subprocess.run(['git', 'diff', '--cached', '--quiet'], cwd=ROOT).returncode
    if changed == 1:
        subprocess.run(['git', 'commit', '-m', 'game: update the shared Connect Four board'], cwd=ROOT, check=True)
        subprocess.run(['git', 'push', 'origin', 'HEAD:master'], cwd=ROOT, check=True)
    elif changed != 0:
        raise RuntimeError('Cannot inspect staged changes')
    # Only close requests after the state is safely committed. A retry is idempotent.
    for number, outcome in outcomes:
        api(f'issues/{number}', 'PATCH', {'state': 'closed'})
        print(f'Issue #{number}: {outcome}')


if __name__ == '__main__':
    run()
