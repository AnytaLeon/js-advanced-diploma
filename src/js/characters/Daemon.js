import Character from '../Character';

export default class Daemon extends Character{
    constructor(level){
        super(level);
        this.attack = 10;
        this.defence = 10;
        this.type = 'daemon';
        this.maxMoveDistance = 1;
        this.maxAttackDistance = 4;
    }
}