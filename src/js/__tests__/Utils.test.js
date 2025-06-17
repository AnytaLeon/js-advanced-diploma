import { calcTileType, getDistance } from '../utils';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';

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

test('check getDistance move', () => {
    const bowman = new Bowman(1);
    const moveDistance = [16, 17, 0, 9, 2, 10, 11, 4, 19, 20, 27, 36, 26, 34, 25, 32];
    moveDistance.sort((a,b) => a-b);
    const expectmoveDistance = getDistance(18, bowman, 8, 'move');

    expect(expectmoveDistance).toEqual(moveDistance);
});

test('check getDistance attack', () => {
    const bowman = new Bowman(1);
    const attackDistance = [16, 17, 0, 9, 2, 10, 11, 4, 19, 20, 27, 36, 26, 34, 25, 32, 8, 1, 3, 12, 28, 35, 33, 24];
    attackDistance.sort((a,b) => a-b);
    const expectattackDistance = getDistance(18, bowman, 8, 'attack');

    expect(expectattackDistance).toEqual(attackDistance);
});