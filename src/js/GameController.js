import GamePlay from './GamePlay';
import cursors from './cursors';
import { generateTeam, getRandomPosition } from './generators';
import themes from './themes';
import Team from './Team';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Magician from './characters/Magician';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
        this.userTeam = new Team();
        this.botTeam = new Team();
        this.botCharacters = [
            Daemon, Undead, Vampire
        ];
        this.userCharacters = [
            Bowman, Swordsman, Magician
        ];
        this.addEventListeners();
        this.positionedCharacters = [];
    }

    init() {

        this.gamePlay.drawUi(themes.prairie);
        this.userTeam.addAll(generateTeam(this.userCharacters, 1, 2));
        this.botTeam.addAll(generateTeam(this.botCharacters, 1, 2));

        this.addCharactersPosition(this.userTeam, this.getPlayerPositions());
        this.addCharactersPosition(this.botTeam, this.getBotPositions());
        console.log(this.positionedCharacters);
        this.gamePlay.redrawPositions(this.positionedCharacters);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    }

    addEventListeners(){
        this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
        this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
        this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    }

    onCellClick(index) {
    // TODO: react to click
    }

    onCellEnter(index) {
    // TODO: react to mouse enter
        if(this.getChar(index)){
            this.gamePlay.setCursor(cursors.pointer);
            const char = this.getCharInCell(index).character;
            const message = `\u{1F396}${char.level} \u{2694}${char.attack} \u{1F6E1}${char.defence} \u{2764}${char.health}`;
            this.gamePlay.showCellTooltip(message, index);
        } else {
            this.gamePlay.setCursor(cursors.auto);
        }
    }

    onCellLeave(index) {
    // TODO: react to mouse leave
        this.gamePlay.setCursor(cursors.auto);
        this.gamePlay.hideCellTooltip(index);
    }

    getPlayerPositions() {
        this.playerPosition = [];
        for (let i = 0 ; i < this.gamePlay.boardSize ** 2; i += this.gamePlay.boardSize) {
            this.playerPosition.push(i, i + 1);
        };

        return this.playerPosition;
    }

    getBotPositions() {
        this.botPosition = [];
        for (let i = 6 ; i < this.gamePlay.boardSize ** 2; i += this.gamePlay.boardSize) {
            this.botPosition.push(i, i + 1);
        };

        return this.botPosition;
    }

    addCharactersPosition(team, positions) {
        const allPositions = [ ...positions ];

        for (const char of team.characters) {
            const indexRandom = getRandomPosition(allPositions);
            this.positionedCharacters.push(new PositionedCharacter(char, indexRandom));
            allPositions.splice(allPositions.indexOf(indexRandom), 1);
        }
    }

    getCharInCell(index) {
        return this.positionedCharacters.find(char => char.position === index);
    }

    getChar(index) {
        if (this.getCharInCell(index)) {
            const char = this.getCharInCell(index);
            return this.positionedCharacters.some(char => char.character);
        }
        return false;
    }
}
