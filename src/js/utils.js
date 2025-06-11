/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {

    let tileType = 'center';
    if (index===0) {
        tileType = 'top-left';
    } else if (boardSize - index === 1) {
        tileType = 'top-right';
    } else if (index === boardSize * boardSize - boardSize) {
        tileType = 'bottom-left';
    } else if (index === (boardSize**2 - 1)) {
        tileType = 'bottom-right';
    } else if (index % boardSize === 0) {
        tileType = 'left';
    } else if ((index +1) % boardSize === 0) {
        tileType = 'right';
    } else if (index < boardSize) {
        tileType = 'top';
    } else if ( index > boardSize * boardSize - boardSize) {
        tileType = 'bottom';
    };

    return tileType;

}

export function calcHealthLevel(health) {
    if (health < 15) {
        return 'critical';
    }

    if (health < 50) {
        return 'normal';
    }

    return 'high';
}
