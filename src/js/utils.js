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

export function getDistance(index, character, boardSize, type) {
    let maxDistance = null;
    let listDistance = [];

    let topLeft = index;
    let top = index;
    let topRight = index;
    let right = index;
    let bottomRight = index;
    let bottom = index;
    let bottomLeft = index;
    let left = index;

    if (type === 'move') {
        maxDistance = character.maxMoveDistance;
    };

    if (type === 'attack') {
        maxDistance = character.maxAttackDistance;
    };

    for(let i = 0; i < maxDistance; i += 1) {
        if(topLeft >= boardSize && topLeft % boardSize !== 0) {
            topLeft -= (boardSize + 1);
            listDistance.push(topLeft);
        };

        if(left % boardSize !== 0) {
            left -= 1;
            listDistance.push(left);
        };

        if(bottomLeft <= (boardSize ** 2 - boardSize) && bottomLeft % boardSize !== 0) {
            bottomLeft += boardSize - 1;
            listDistance.push(bottomLeft);
        };

        if(bottom <=  (boardSize ** 2 - boardSize)) {
            bottom += boardSize;
            listDistance.push(bottom);
        };

        if(bottomRight <=  (boardSize ** 2 - boardSize) && (bottomRight + 1) % boardSize !== 0) {
            bottomRight += (boardSize + 1);
            listDistance.push(bottomRight);
        };

        if(right % boardSize !== boardSize - 1) {
            right += 1;
            listDistance.push(right);
        };

        if(topRight >= boardSize && topRight % boardSize !== boardSize - 1) {
            topRight -= (boardSize - 1);
            listDistance.push(topRight);
        };

        if(top >= boardSize) {
            top -= boardSize;
            listDistance.push(top);
        };
    };
    if (type === 'attack') {
        const rowLeft = Math.floor(top / boardSize);
        const rowRight = Math.floor(bottom / boardSize);
        const colTop = (left % boardSize);
        const colBottom = (right % boardSize);

        for(let i = rowLeft; i <= rowRight; i += 1) {
            for(let j = colTop; j <= colBottom; j += 1) {
                listDistance.push(i * boardSize + j);
            }
        }
    };

    listDistance = listDistance.filter(elem => elem !== index);

    const distance = [ ...new Set(listDistance) ];

    return distance.sort((a,b) => a-b);
}
