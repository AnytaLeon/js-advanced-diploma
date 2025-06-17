import Character from '../Character';

export default class Undead extends Character{
    constructor(level){
        super(level);
        this.attack = 40;
        this.defence = 10;
        this.type = 'undead';
        this.maxMoveDistance = 4;
        this.maxAttackDistance = 1;
    }
}