import { _decorator, Button, Component, director, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const credit = `
<크레딧>
# 잉여톤 30회 ~ 31회 중장기 잉여 프로젝트
----
* 타이틀 - 콜맥 히어로!
* 개발자 - 장은준
* 리소스 - 잇치 아이오
* 개발도구 - 코코스 크리에이터 3.7.3
* 깃허브 - https://github.com/SilverJun/yingyeothon30

# 플레이 해주셔서 감사합니다!
</크레딧>
`


@ccclass('GameTitle')
export class GameTitle extends Component {

    @property({type: Node})
    bg: Node;

    @property({type: Node})
    tutorialParent: Node;

    @property({type: Prefab})
    attachTutorial: Prefab;

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

        if (this.btnTutorial) {
            this.btnTutorial.node.on(Button.EventType.CLICK, () => {
                if (this.tutorialParent.children.length == 0) {
                    const popup = instantiate(this.attachTutorial);
                    popup.position = new Vec3(0, 0, 0);
                    this.tutorialParent.addChild(popup);
                } else {
                    this.tutorialParent.removeAllChildren();
                }
            }, this);
        }

        if (this.btnCredit) {
            console.log(credit);
        }
    }

    update(deltaTime: number) {

    }
}

