import Character from '../Character';

export default class Magician extends Character{
    constructor(level){
        super(level);
        this.attack = 10;
        this.defence = 40;
        this.type = 'magician';
        this.maxMoveDistance = 1;
        this.maxAttackDistance = 4;
    }
}