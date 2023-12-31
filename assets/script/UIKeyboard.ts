import { _decorator, Button, Component, EventKeyboard, Input, input, KeyCode, Node } from 'cc';
import { Settings } from './Settings';
import { UIKey } from './UIKey';
const { ccclass, property } = _decorator;


@ccclass('UIKeyboard')
export class UIKeyboard extends Component {

    private keyButtons: Map<KeyCode, UIKey> = new Map();

    private keys = [
        KeyCode.KEY_A,
        KeyCode.KEY_B,
        KeyCode.KEY_C,
        KeyCode.KEY_D,
        KeyCode.KEY_E,
        KeyCode.KEY_F,
        KeyCode.KEY_G,
        KeyCode.KEY_H,
        KeyCode.KEY_I,
        KeyCode.KEY_J,
        KeyCode.KEY_K,
        KeyCode.KEY_L,
        KeyCode.KEY_M,
        KeyCode.KEY_N,
        KeyCode.KEY_O,
        KeyCode.KEY_P,
        KeyCode.KEY_Q,
        KeyCode.KEY_R,
        KeyCode.KEY_S,
        KeyCode.KEY_T,
        KeyCode.KEY_U,
        KeyCode.KEY_V,
        KeyCode.KEY_W,
        KeyCode.KEY_X,
        KeyCode.KEY_Y,
        KeyCode.KEY_Z,
        KeyCode.PERIOD,
        KeyCode.COMMA,
        KeyCode.SLASH,
        KeyCode.SEMICOLON,
        KeyCode.QUOTE,
        KeyCode.BRACKET_LEFT,
        KeyCode.BRACKET_RIGHT,
    ];

    private keyHandler: (keyCode: KeyCode) => void;

    protected onLoad(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        const buttons = this.node.getComponentsInChildren(UIKey);
        buttons.forEach(key => {
            const keyName = key.node.name.slice(0, -3);
            const keyCode = keyName.length == 1 ? `KEY_${keyName}` : keyName;
            this.keyButtons.set(KeyCode[keyCode], key);
        });
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    onKeyDown(event: EventKeyboard) {
        const keyCode = this.convertInputKeyCode(event.keyCode);
        console.log('key Pressed: ',KeyCode[keyCode]);
        if (this.isAllowKey(keyCode) == false) return;

        this.keyButtons.get(keyCode)._applyTransition("pressed");

        this.keyHandler?.(keyCode);
    }

    onKeyUp(event: EventKeyboard) {
        const keyCode = this.convertInputKeyCode(event.keyCode);
        console.log('key Up: ',KeyCode[keyCode]);
        if (this.isAllowKey(keyCode) == false) return;

        this.keyButtons.get(keyCode)._applyTransition("normal");
    }

    convertInputKeyCode(keyCode: KeyCode): KeyCode {
        if (Settings.layout === 'colemak') {
            return keyCode;
        } else {
            switch (keyCode) {
                case KeyCode.KEY_E: return KeyCode.KEY_F;
                case KeyCode.KEY_R: return KeyCode.KEY_P;
                case KeyCode.KEY_T: return KeyCode.KEY_G;
                case KeyCode.KEY_Y: return KeyCode.KEY_J;
                case KeyCode.KEY_U: return KeyCode.KEY_L;
                case KeyCode.KEY_I: return KeyCode.KEY_U;
                case KeyCode.KEY_O: return KeyCode.KEY_Y;
                case KeyCode.KEY_P: return KeyCode.SEMICOLON;
                case KeyCode.KEY_S: return KeyCode.KEY_R;
                case KeyCode.KEY_D: return KeyCode.KEY_S;
                case KeyCode.KEY_F: return KeyCode.KEY_T;
                case KeyCode.KEY_G: return KeyCode.KEY_D;
                case KeyCode.KEY_J: return KeyCode.KEY_N;
                case KeyCode.KEY_K: return KeyCode.KEY_E;
                case KeyCode.KEY_L: return KeyCode.KEY_I;
                case KeyCode.SEMICOLON: return KeyCode.KEY_O;
                case KeyCode.KEY_N: return KeyCode.KEY_K;
                default: return keyCode;
            }
        }
    }


    public addKeyHandler(handler: (keyCode: KeyCode) => void) {
        this.keyHandler = handler;
    }

    isAllowKey(keyCode: KeyCode) {
        return this.keys.includes(keyCode);
    }

    getRandomKeyCode(): KeyCode {
        // 브라켓은 안나오게 수정한것. 나중에는 스테이지 별로 나오는 키를 다르게 해야할듯
        return this.keys[Math.floor(Math.random() * (this.keys.length-2))];
    }

    missKey(keyCode: KeyCode) {
        if (this.isAllowKey(keyCode)) {
            const key = this.keyButtons.get(keyCode);
            key.missCount += 1;
        }
    }
}

