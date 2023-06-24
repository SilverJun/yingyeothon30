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

    @property({type: UIKeyboard})
    keyboard!: UIKeyboard;

    @property({type: SpAnimator})
    spriteAnimator!: SpAnimator;

    start() {
        this.keyboard.addKeyHandler((keyCode) => {
            this.spriteAnimator.Anmimation = PlayerAnim.ATTACK;
            this.spriteAnimator.animationEndCallback = (anim: number) => {
                this.spriteAnimator.Anmimation = PlayerAnim.IDLE;
            }
        });
    }

    update(deltaTime: number) {

    }
}

