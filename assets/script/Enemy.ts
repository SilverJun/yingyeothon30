import { _decorator, Component, KeyCode, Label, Node, tween, Vec3 } from 'cc';
import { SpAnimator } from './SpAnimator';
const { ccclass, property } = _decorator;


enum EnemyAnim {
    RUN = 0,
    DEAD = 1,
}

@ccclass('Enemy')
export class Enemy extends Component {


    @property({type: SpAnimator})
    spriteAnimator!: SpAnimator;

    @property({type: Label})
    keyLabel!: Label;

    private targetKey: KeyCode = KeyCode.NONE;

    public arrivedCallback?: (enemy: Enemy) => void;

    start() {
        tween()
            .target(this.node)
            .to(5, {position: new Vec3(120, this.node.getPosition().y, 0)})
            .call(() => {
                this.arrivedCallback?.(this);
                this.node.destroy();
            })
            .start();
    }

    update(deltaTime: number) {

    }

    public Hit() {
        this.spriteAnimator.Anmimation = EnemyAnim.DEAD;
        this.spriteAnimator.animationEndCallback = (anim: number) => {
            this.node.destroy();
        }
    }

    public setTargetKey(keyCode: KeyCode) {
        this.targetKey = keyCode;
        const keyString = KeyCode[keyCode];
        this.keyLabel.string = keyString.startsWith('KEY_') ? keyString.slice(4) : this.getPunctuationString(keyCode);
    }

    public getTargetKey(): KeyCode {
        return this.targetKey;
    }

    getPunctuationString(keyCode: KeyCode) {
        switch (keyCode) {
            case KeyCode.PERIOD: return '.';
            case KeyCode.COMMA: return ',';
            case KeyCode.SEMICOLON: return ';';
            case KeyCode.QUOTE: return '\'';
            case KeyCode.SLASH: return '/';
            case KeyCode.BRACKET_LEFT: return '[';
            case KeyCode.BRACKET_RIGHT: return ']';
            default: return '';
        }
    }
}

