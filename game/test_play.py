import random
import unittest
from play import fresh, link, move, render, won


class GameTests(unittest.TestCase):
    def test_gravity_and_alternating_players(self):
        state, _ = move(fresh(), 'play|1|0|4', 'hamzaxbella', 1)
        state, _ = move(state, 'play|1|1|4', 'visitor', 2)
        self.assertEqual([row[3] for row in state['board']], [0, 0, 0, 0, 2, 1])

    def test_all_winning_directions_and_edges(self):
        for x, y, dx, dy in [(0, 5, 1, 0), (6, 2, 0, 1), (0, 0, 1, 1), (3, 5, 1, -1)]:
            board = fresh()['board']
            for i in range(4):
                board[y+i*dy][x+i*dx] = 2
            self.assertTrue(won(board, 2))
            self.assertFalse(won(board, 1))

    def test_stale_duplicate_and_malformed_do_not_mutate(self):
        state, _ = move(fresh(), 'play|1|0|4', 'visitor', 1)
        for title, issue in [('play|1|0|5', 2), ('play|1|1|5', 1),
                             ('play|1|1|8', 3), ('play|1|1|0', 4),
                             ('play|1|1|4\n', 5), ('play|1|1|$(echo bad)', 6),
                             ('play|2|1|4', 7), ('play|1|1|new', 8)]:
            result, _ = move(state, title, 'visitor', issue)
            self.assertEqual(result, state)

    def test_full_column_is_rejected(self):
        state = fresh()
        for turn in range(6):
            state, _ = move(state, f'play|1|{turn}|1', 'visitor', turn+1)
        result, reason = move(state, 'play|1|6|1', 'visitor', 7)
        self.assertEqual(reason, 'Column full')
        self.assertEqual(result, state)

    def test_win_and_new_game(self):
        state = fresh()
        for turn, column in enumerate([1, 2, 1, 2, 1, 2, 1]):
            state, _ = move(state, f'play|1|{turn}|{column}', 'visitor', turn+1)
        self.assertTrue(state['finished'])
        self.assertEqual(state['winner'], 1)
        result, _ = move(state, 'play|1|7|3', 'visitor', 8)
        self.assertEqual(result, state)
        result, _ = move(state, 'play|1|7|new', 'visitor', 9)
        self.assertEqual(result['number'], 2)
        self.assertEqual(result['turn'], 0)
        self.assertIn(9, result['processed'])

    def test_random_games_preserve_rules_and_can_draw(self):
        rng = random.Random(27)
        draws = 0
        for game in range(500):
            state = fresh()
            while not state['finished']:
                col = rng.choice([x+1 for x in range(7) if not state['board'][0][x]])
                turn = state['turn']
                state, reason = move(state, f'play|1|{turn}|{col}', 'visitor', turn+1)
                self.assertEqual(reason, 'Move accepted')
                self.assertEqual(sum(bool(v) for row in state['board'] for v in row), turn+1)
            if not state['winner']:
                draws += 1
                self.assertEqual(state['turn'], 42)
        self.assertGreater(draws, 0)

    def test_render_links_target_current_state(self):
        state = fresh(2)
        self.assertIn('play%7C2%7C0%7C4', link(state, 4))
        self.assertEqual(render(state).count('⚪'), 42)
        self.assertIn('Game 2 · 0 moves', render(state))


if __name__ == '__main__':
    unittest.main()
