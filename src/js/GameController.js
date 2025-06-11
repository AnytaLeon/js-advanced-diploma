import GamePlay from './GamePlay';
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
    }

    init() {

        this.gamePlay.drawUi(themes.prairie);
        this.userTeam.addAll(generateTeam(this.userCharacters, 1, 2));
        this.botTeam.addAll(generateTeam(this.botCharacters, 1, 2));

        this.positionedCharacters = [];
        this.addCharactersPosition(this.userTeam, this.getPlayerPositions());
        this.addCharactersPosition(this.botTeam, this.getBotPositions());
        this.gamePlay.redrawPositions(this.positionedCharacters);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    }

    onCellClick(index) {
    // TODO: react to click
    }

    onCellEnter(index) {
    // TODO: react to mouse enter
    }

    onCellLeave(index) {
    // TODO: react to mouse leave
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
      const allPositions = [...positions];
  
      for (const char of team.characters) {
        const indexRandom = getRandomPosition(allPositions);
        this.positionedCharacters.push(new PositionedCharacter(char, indexRandom));
        allPositions.splice(allPositions.indexOf(indexRandom), 1);
      }
    }
}
