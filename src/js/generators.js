/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
    // TODO: write logic here
    while (true) {
        const index = Math.floor(Math.random() * allowedTypes.length);
        const level = Math.floor(Math.random() * maxLevel) + 1;
        const randomType = allowedTypes[index];
        yield new randomType(level);
    }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
    // TODO: write logic here
    const team = [];
    const playerGenerator = characterGenerator(allowedTypes, maxLevel);

    for(let i = 0; i < characterCount; i += 1) {
        team.push(playerGenerator.next().value);
    };

    return team;
}

export function getRandomPosition(positions) {
    return positions[Math.floor(Math.random() * positions.length)];
}
