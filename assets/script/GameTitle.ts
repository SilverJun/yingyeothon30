import { _decorator, Button, Component, director, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameTitle')
export class GameTitle extends Component {

    @property({type: Node})
    bg: Node;

    @property({type: Button})
    btnStart: Button;

    @property({type: Button})
    btnTutorial: Button;

    @property({type: Button})
    btnCredit: Button;

    start() {
        tween(this.bg)
            .repeatForever(tween()
                .to(5, {position: new Vec3(-1005, 0, 0)})
                .set({position: new Vec3(0, 0, 0)})
            )
            .start();

        if (this.btnStart) {
            this.btnStart.node.on(Button.EventType.CLICK, () => {
                director.loadScene('GameScene');
            }, this);
        }
    }

    update(deltaTime: number) {

    }
}

