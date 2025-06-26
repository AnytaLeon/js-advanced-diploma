
export default class GameState {
    constructor(){
        this.level = 1;
        this.positionedCharacters = [];
        this.playerSelected = null;
        this.points = 0;
        this.statistics = [];
        this.isUsersTurn = true;
    }
    static from(object) {
        if (typeof object === 'object') {
            return object;
        };

        return null;
    }
}
