//Проверьте, выдаёт ли генератор characterGenerator бесконечно новые персонажи из списка (учёт аргумента allowedTypes)

import { generateTeam, characterGenerator } from '../generators';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';

//Проверьте, выдаёт ли генератор characterGenerator бесконечно новые персонажи из списка
test('check characterGenerator', () => {
    const allowedTypes = [
        Bowman, Swordsman, Magician
    ];
    expect(characterGenerator(allowedTypes, 10).next().done).toBeFalsy();
});

//Проверьте, выдаёт ли генератор characterGenerator новые персонажи из списка
test('check characterGenerator', () => {
    const allowedTypes = [
        Bowman, Swordsman, Magician
    ];
    const characterCount = 5;
    const team = generateTeam(allowedTypes, 3, characterCount);
    expect(team.every(item => allowedTypes.some(character => item instanceof character ))).toBeTruthy();
});

//Проверьте, в нужном ли количестве создаются персонажи при вызове generateTeam
test('check generateTeam', () => {
    const allowedTypes = [
        Bowman, Swordsman, Magician
    ];
    const characterCount = 50;
    const team = generateTeam(allowedTypes, 3, characterCount);

    expect(team.length).toBe(50);
});

//Проверьте, в нужном ли  диапазоне уровней (учёт аргумента maxLevel) создаются персонажи при вызове generateTeam
test('check generateTeam', () => {
    const allowedTypes = [
        Bowman, Swordsman, Magician
    ];
    const characterCount = 5;
    const team = generateTeam(allowedTypes, 10, characterCount);

    expect(team.every(item => (item.level >= 1 && item.level <= 10))).toBeTruthy();
});

