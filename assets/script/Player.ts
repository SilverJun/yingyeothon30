import { _decorator, Component, Node } from 'cc';
import { UIKeyboard } from './UIKeyboard';
import { SpAnimator } from './SpAnimator';
const { ccclass, property } = _decorator;


enum PlayerAnim {
    IDLE = 0,
    ATTACK = 1,
}

@ccclass('Player')
export class Player extends Component {

    @property({type: SpAnimator})
    spriteAnimator!: SpAnimator;

    @property()


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
}

