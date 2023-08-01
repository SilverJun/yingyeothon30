import { _decorator, Component, Node } from 'cc';
import { UIKeyboard } from './UIKeyboard';
import { SpAnimator } from './SpAnimator';
const { ccclass, property } = _decorator;


enum PlayerAnim {
    IDLE = 0,
    ATTACK = 1,
    DEAD = 2,
}

@ccclass('GamePlayer')
export class GamePlayer extends Component {

    @property({type: SpAnimator})
    spriteAnimator!: SpAnimator;

    start() {
    }

    update(deltaTime: number) {

    }

    public attack() {
        this.spriteAnimator.Anmimation = PlayerAnim.ATTACK;
        this.spriteAnimator.animationEndCallback = (anim: number) => {
            this.spriteAnimator.Anmimation = PlayerAnim.IDLE;
        }
    }

    public dead() {
        this.spriteAnimator.Anmimation = PlayerAnim.DEAD;
        this.spriteAnimator.animationEndCallback = () => {};
    }
}

