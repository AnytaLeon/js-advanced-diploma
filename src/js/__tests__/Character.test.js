import Character from '../Character';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test('error when creating an object of the Character class', () => {
    expect(() => new Character(1)).toThrow(new Error('Don\'t use class Character'));
});

//Проверьте, правильные ли характеристики содержат создаваемые персонажи 1-ого уровня

test.each([
    [
        Bowman, {
            level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', maxMoveDistance: 2, maxAttackDistance: 2
        }
    ],
    [
        Daemon, {
            level: 1, attack: 10, defence: 10, health: 50, type: 'daemon', maxMoveDistance: 1, maxAttackDistance: 4
        }
    ],
    [
        Magician, {
            level: 1, attack: 10, defence: 40, health: 50, type: 'magician', maxMoveDistance: 1, maxAttackDistance: 4
        }
    ],
    [
        Swordsman, {
            level: 1, attack: 40, defence: 10, health: 50, type: 'swordsman', maxMoveDistance: 4, maxAttackDistance: 1
        }
    ],
    [
        Undead, {
            level: 1, attack: 40, defence: 10, health: 50, type: 'undead', maxMoveDistance: 4, maxAttackDistance: 1
        }
    ],
    [
        Vampire, {
            level: 1, attack: 25, defence: 25, health: 50, type: 'vampire', maxMoveDistance: 2, maxAttackDistance: 2
        }
    ],
])('check creating of characters', (Instance, expected) => {
    const char = new Instance(1);
    expect(char).toEqual(expected);
});

