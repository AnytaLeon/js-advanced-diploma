import Character from '../Character';

export default class Bowman extends Character{
    constructor(level){
        super(level);
        this.attack = 25;
        this.defence = 25;
        this.type = 'bowman';
        this.maxMoveDistance = 2;
        this.maxAttackDistance = 2;
    }
}