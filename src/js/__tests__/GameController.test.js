import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';
import cursors from '../cursors';
import Daemon from '../characters/Daemon';
import Swordsman from '../characters/Swordsman';
import Vampire from '../characters/Vampire';

const stateService = new GameStateService();
const testCtrl = new GameController(new GamePlay(), stateService);

const posVampire = new PositionedCharacter(new Vampire(1), 30);
const posSwordsman = new PositionedCharacter(new Swordsman(1), 1);
const posBowman = new PositionedCharacter(new Bowman(1), 24);
const posDaemon = new PositionedCharacter(new Daemon(1), 25);
testCtrl.gamePlay.selectCell = jest.fn();
testCtrl.gamePlay.setCursor = jest.fn();
testCtrl.gameState.positionedCharacters.push(posBowman, posSwordsman, posVampire, posDaemon);
testCtrl.gamePlay.showCellTooltip = jest.fn();
testCtrl.gamePlay.hideCellTooltip = jest.fn();

test('Если в ячейке есть персонаж игрока, то курсор = pointer', () => {
    testCtrl.onCellEnter(24);
    expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});

test('корректность вывода характеристик', () => {
    testCtrl.onCellEnter(24);
    expect(testCtrl.gamePlay.showCellTooltip).toHaveBeenCalledWith('\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50', 24);
});

test('Метод onCellLeave вызывает hideCellTooltip и курсор = auto', () => {
    testCtrl.onCellLeave(24);
    expect(testCtrl.gamePlay.hideCellTooltip).toBeCalled();
    expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.auto);
});

test('Если в ячейке есть персонаж противника, то курсор = crosshair', () => {
    testCtrl.gameState.playerSelected = 24;
    testCtrl.onCellEnter(25);
    expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.crosshair);
});

test('Если персонаж выбран, но не валидный диапазон, то курсор = notallowed', () => {
    testCtrl.gameState.playerSelected = 1;
    testCtrl.onCellEnter(63);
    expect(testCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
});