import { calcTileType } from '../utils';

test.each([
    [
        0, 8, 'top-left'
    ],
    [
        1, 8, 'top'
    ],
    [
        9, 8, 'center'
    ],
    [
        7, 8, 'top-right'
    ],
    [
        15, 8, 'right'
    ],
    [
        63, 8, 'bottom-right'
    ],
    [
        7, 7, 'left'
    ],
    [
        62, 8, 'bottom'
    ]
])('check type of tile by index and boardsize', (index, boardsize, type) => {
    expect(calcTileType(index, boardsize)).toBe(type);
});