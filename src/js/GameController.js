import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import { getDistance } from './utils';
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
const botCharacters = [
    Daemon, Undead, Vampire
];
const userCharacters = [
    Bowman, Swordsman, Magician
];

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
        this.userTeam = new Team();
        this.botTeam = new Team();
        this.gameState = new GameState();
    }

    init() {

        this.gamePlay.drawUi(themes.prairie);
        this.userTeam = new Team();
        this.botTeam = new Team();
        this.userTeam.addAll(generateTeam(userCharacters, 1, 2));
        this.botTeam.addAll(generateTeam(botCharacters, 1, 2));
        this.gameState.positionedCharacters = [];

        this.addCharactersPosition(this.userTeam, this.getPlayerPositions());
        this.addCharactersPosition(this.botTeam, this.getBotPositions());
        const load = this.stateService.load();

        this.gameState.statistics = load.statistics;
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        this.addEventListeners();

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    }

    addEventListeners(){
        this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
        this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
        this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
        this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
        this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
        this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    }

    onNewGame(){

        this.stateService.save(GameState.from({
            positionedCharacters: [ ...this.gameState.positionedCharacters ],
            playerSelected: this.gameState.playerSelected,
            level: this.gameState.level,
            points: this.gameState.points,
            statistics: [ ...this.gameState.statistics ]
        }));
        this.init();
        const load = this.stateService.load();
        this.gameState.statistics = load.statistics;
        this.gameState.level = 1;
        this.gameState.playerSelected = null;
        this.gameState.points = 0;

    }

    saveGame(){
        this.stateService.save(GameState.from(this.gameState));
        if (!localStorage.getItem('state')) {
            GamePlay.showError('Игра не сохранена');
        };
        GamePlay.showMessage('Игра успешно сохранена');
    }

    loadGame() {
        const load = this.stateService.load();
        if (!load) {
            GamePlay.showMessage('Нет сохраненной игры');
            return;
        };
        this.gamePlay.drawUi(themes[Object.keys(themes)[load.level - 1]]);
        this.gameState.level = load.level;
        this.gameState.points = load.points;
        this.gameState.statistics = load.statistics;
        this.gameState.playerSelected = load.playerSelected;
        this.gameState.positionedCharacters = [];

        this.userTeam = new Team();
        this.botTeam = new Team();
        load.positionedCharacters.forEach((item) => {
            let char;
            switch (item.character.type) {
            case 'swordsman':
                char = new Swordsman(item.character.level);
                this.userTeam.add([ char ]);
                break;
            case 'bowman':
                char = new Bowman(item.character.level);
                this.userTeam.add([ char ]);
                break;
            case 'magician':
                char = new Magician(item.character.level);
                this.userTeam.add([ char ]);
                break;
            case 'undead':
                char = new Undead(item.character.level);
                this.botTeam.add([ char ]);
                break;
            case 'vampire':
                char = new Vampire(item.character.level);
                this.botTeam.add([ char ]);
                break;
            case 'daemon':
                char = new Daemon(item.character.level);
                this.botTeam.add([ char ]);
                break;
            // no default
            }
            char.health = item.character.health;
            this.gameState.positionedCharacters.push(new PositionedCharacter(char, item.position));
        });

        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

        GamePlay.showMessage('Игра успешно загружена');
    }

    onCellClick(index) {
    // TODO: react to click
        if(this.getChar(index) && this.isUserSelected(index)) {
            this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected'));
            this.gameState.positionedCharacters.forEach(item => this.gamePlay.deselectCell(item.position));
            this.gameState.playerSelected = index;
            this.gamePlay.selectCell(index);

        }

        if(!this.getChar(index) && this.gameState.playerSelected && this.checkUserDistance(index, 'move')) {
            this.changeCellUser(index);
            this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-yellow'));
            this.changePlayer();
            this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
        }
        if(this.gameState.playerSelected && this.checkUserDistance(index, 'attack') && this.isBotSelected(index)) {
            const attacker = this.getSelectedChar().character;
            const target = this.getCharInCell(index).character;
            this.userAttack(index, attacker, target);
        }
    }

    onCellEnter(index) {
    // TODO: react to mouse enter
        this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
        this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'));

        if(this.isUserSelected(index)) {
            this.gamePlay.setCursor(cursors.pointer);
        } else {
            this.gamePlay.setCursor(cursors.auto);
        };

        if(this.getChar(index)){
            const char = this.getCharInCell(index).character;
            const message = `\u{1F396}${char.level} \u{2694}${char.attack} \u{1F6E1}${char.defence} \u{2764}${char.health}`;
            this.gamePlay.showCellTooltip(message, index);
        };

        if (!this.getChar(index) && this.gameState.playerSelected && this.checkUserDistance(index, 'move')) {
            this.gamePlay.selectCell(index, 'green');
        }

        if(this.gameState.playerSelected && !this.checkUserDistance(index, 'move') && !this.checkUserDistance(index, 'attack') && !this.isBotSelected(index)) {
            this.gamePlay.setCursor(cursors.notallowed);
        }

        if(this.gameState.playerSelected && this.isBotSelected(index) && this.checkUserDistance(index, 'attack')) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, 'red');
        };
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
            this.gameState.positionedCharacters.push(new PositionedCharacter(char, indexRandom));
            allPositions.splice(allPositions.indexOf(indexRandom), 1);
        }
    }

    getCharInCell(index) {
        return this.gameState.positionedCharacters.find(char => char.position === index);
    }

    getChar(index) {
        if (this.getCharInCell(index)) {
            const char = this.getCharInCell(index);
            return this.gameState.positionedCharacters.some(char => char.character);
        }
        return false;
    }

    getSelectedChar() {
        return this.gameState.positionedCharacters.find(char => char.position === this.gameState.playerSelected);
    }

    isUserSelected(index){
        if(this.getCharInCell(index)) {
            const user = this.getCharInCell(index);
            return userCharacters.some(char => user.character instanceof char);
        }

        return false;
    };

    isBotSelected(index){
        if(this.getCharInCell(index)) {
            const bot = this.getCharInCell(index);
            return botCharacters.some(char => bot.character instanceof char);
        }

        return false;
    };

    checkUserDistance(index, type) {
        if(this.getSelectedChar()) {
            const position = this.getSelectedChar().position;
            const character = this.getSelectedChar().character;
            const distance = getDistance(position, character, this.gamePlay.boardSize, type);

            return distance.includes(index);
        }
    }

    changeCellUser(index) {
        this.getSelectedChar().position = index;
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        this.gameState.playerSelected = null;
    }

    userAttack(index, attacker, target) {

        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        this.gamePlay.showDamage(index, damage).then(() => {
            target.health -= damage;
            this.gameState.points += damage;

            if(target.health <= 0) {
                this.botTeam.deleteCharacter(target);
                this.gameState.positionedCharacters.splice(this.gameState.positionedCharacters.indexOf(this.getCharInCell(index)), 1);
            }
        }).then(() => {
            this.gameState.playerSelected = null;
            this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

        }).then(() => {
            this.getGameResult();
            this.botAttack();
        });
    }

    botAttack() {
        const userTeam = this.gameState.positionedCharacters.filter((char) => (char.character instanceof Bowman || char.character instanceof Swordsman || char.character instanceof Magician));
        const botTeam = this.gameState.positionedCharacters.filter((char) => (char.character instanceof Vampire || char.character instanceof Undead || char.character instanceof Daemon));

        let target = null;
        let attacker = null;

        //выбираю, есть ли игрок в userTeam в поле атаки у какого-нибудь игрока botTeam
        for(const user of userTeam) {
            for(const bot of botTeam) {
                const distance = getDistance(bot.position, bot.character, this.gamePlay.boardSize, 'attack');
                if (distance.includes(user.position)) {
                    target = user;
                    attacker = bot;
                };
            }
        };

        if (target) {
            this.gamePlay.selectCell(target.position, 'red');
            const damage = Math.max(attacker.character.attack - target.character.defence, attacker.character.attack * 0.1);
            this.gamePlay.showDamage(target.position, damage).then(() => {
                target.character.health -= damage;
                if(target.character.health <= 0) {
                    this.userTeam.deleteCharacter(target.character);
                    this.gameState.positionedCharacters.splice(this.gameState.positionedCharacters.indexOf(this.getCharInCell(target.position)), 1);
                }
            }).then(() => {
                this.gameState.playerSelected = null;
                this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
            }).then(() => {
                this.getGameResult();
            });

        } else {
            // если такого игрока нет, случайный игрок botTeam делает случайный ход
            const botCurrent = botTeam[Math.floor(Math.random() * botTeam.length)];
            if(!botCurrent) return;
            const moveDistance = getDistance(botCurrent.position, botCurrent.character, this.gamePlay.boardSize, 'move');

            for (const cell of moveDistance) {
                for (const char of this.gameState.positionedCharacters) {
                    if (cell === char.position) {
                        moveDistance.splice(moveDistance.indexOf(char.position), 1);
                    }
                }
            };
            botCurrent.position = moveDistance[Math.floor(Math.random() * moveDistance.length)];
            this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        }
    }

    changePlayer() {
        this.gameState.playerSelected = null;
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        this.botAttack();
    }

    getGameResult() {
        let totalPoints = this.gameState.statistics.reduce((a, b) => a + b, 0);

        if(this.userTeam.characters.size === 0 ) {
            this.gameState.statistics.push(this.gameState.points);
            GamePlay.showMessage(`Вы проиграли! У вас очков - ${totalPoints + this.gameState.points}!`);
            this.removeListenerBoard();

        };
        if(this.botTeam.characters.size === 0 && this.gameState.level < 4) {
            this.gameState.statistics.push(this.gameState.points);
            this.gameState.level += 1;
            this.upGradeLevel();
            GamePlay.showMessage(`Вы перешли на level ${this.gameState.level}, у вас очков - ${totalPoints + this.gameState.points}!`);
        }
        if(this.botTeam.characters.size === 0 && this.gameState.level === 4) {
            this.gameState.statistics.push(this.gameState.points);
            GamePlay.showMessage(`Поздравляю! Вы выиграли, у вас очков - ${totalPoints + this.gameState.points}!`);
            this.removeListenerBoard();
        }
    }

    removeListenerBoard() {
        this.gamePlay.cellClickListeners = [];
        this.gamePlay.cellEnterListeners = [];
        this.gamePlay.cellLeaveListeners = [];
    }

    upGradeLevel() {
        this.gameState.positionedCharacters = [];
        this.userTeam.characters.forEach(char => char.levelUp());

        switch(this.gameState.level) {
        case 2:
            this.gamePlay.drawUi(themes.desert);
            this.userTeam.addAll(generateTeam(userCharacters, 1, 1));
            this.botTeam.addAll(generateTeam(botCharacters, 1, this.userTeam.characters.size));

            break;

        case 3:
            this.gamePlay.drawUi(themes.arctic);
            this.userTeam.addAll(generateTeam(userCharacters, 2, 2));
            this.botTeam.addAll(generateTeam(botCharacters, 3, this.userTeam.characters.size));
            break;

        case 4:
            this.gamePlay.drawUi(themes.mountain);
            this.userTeam.addAll(generateTeam(userCharacters, 3, 2));
            this.botTeam.addAll(generateTeam(botCharacters, 4, this.userTeam.characters.size));
            break;
        };

        this.addCharactersPosition(this.userTeam, this.getPlayerPositions());
        this.addCharactersPosition(this.botTeam, this.getBotPositions());
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    }
}
