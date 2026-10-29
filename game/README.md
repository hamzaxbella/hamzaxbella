# One more game?

A single Connect Four board shared by everyone visiting this profile.

1. Choose a numbered column in the profile README.
2. GitHub opens a prefilled issue. Submit it without changing the title.
3. Wait for the **README Connect Four** workflow to finish, then refresh the profile.

Red and yellow alternate. Join whichever side is next. Connect four horizontally,
vertically, or diagonally. When the game ends, anyone can start the next one.
Moves and GitHub usernames are public. No extra account, app authorization, or installation.

If two people choose a move from the same board, the first valid request wins.
The other request closes without changing the board: refresh and choose again.
Full columns and malformed requests are ignored. A retry cannot play the same move twice.
There is no automatic reset in the middle of a game.

## Inside the experiment

The board is ordinary Markdown. Python's standard library validates moves and writes
only the marked game block in the README and `game/state.json`. GitHub Actions
commits those two files, then closes processed requests. No browser script or external
database is involved. Play is asynchronous; GitHub Actions and page caching determine
how quickly a move appears.

The workflow processes all open game requests in order, including requests whose
individual workflow run was replaced in GitHub's pending queue. Only trusted code
from `master` executes; issue text is parsed as data, never passed to a shell.
If a push fails, requests stay open for the next run. The owner can retry with
**Actions → README Connect Four → Run workflow**.

Run the tests locally:

```sh
python3 -m unittest discover -s game -p 'test_*.py'
```

## Inspiration

The idea follows [Jonathan Gin's community Connect Four](https://github.com/JonathanGin52/JonathanGin52)
and [Marc Zhu's README chess](https://github.com/marcizhu/readme-chess), which credits
[Tim Burgan's original community chess](https://github.com/timburgan/timburgan).
This is an independent Python implementation; their source code and artwork are not copied.
