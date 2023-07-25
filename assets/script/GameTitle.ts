import { _decorator, Button, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameTitle')
export class GameTitle extends Component {

    @property({type: Button})
    btnStart: Button;

    @property({type: Button})
    btnTutorial: Button;

    @property({type: Button})
    btnCredit: Button;

    start() {
        if (this.btnStart) {
            this.btnStart.node.on(Button.EventType.CLICK, () => {
                director.loadScene('GameScene');
            }, this);
        }
    }

    update(deltaTime: number) {

    }
}

