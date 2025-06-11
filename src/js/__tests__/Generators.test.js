//Проверьте, выдаёт ли генератор characterGenerator бесконечно новые персонажи из списка (учёт аргумента allowedTypes)

import { characterGenerator, generateTeam } from '../generators/characterGenerator';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Team from '../Team';

test('check characterGenerator', () => {
    const players = [Bowman, Magician, Swordsman];
    const team = generateTeam(players, 1, 5);

    expect(team.length).toBe(5);
});
