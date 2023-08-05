import { _decorator, Collider2D, Color, Component, Contact2DType, director, Enum, instantiate, IPhysics2DContact, KeyCode, Node, PhysicsSystem2D, Prefab, ProgressBar, RichText, Sprite } from 'cc';
import { UIKeyboard } from './UIKeyboard';
import { GamePlayer } from './GamePlayer';
import { Enemy } from './Enemy';
import { Settings, SwitchData, SwitchType } from './Settings';
const { ccclass, property } = _decorator;

Enum(SwitchType);

enum GameState {
    INIT = 0,
    READY = 1,
    PLAYING = 2,
    END = 3
}

@ccclass('GameStage')
export class GameStage extends Component {

    @property({type: RichText})
    hpText!: RichText;
    @property({type: UIKeyboard})
    keyboard!: UIKeyboard;
    @property({type: GamePlayer})
    player!: GamePlayer;
    @property({type: Node})
    spawnPlace!: UIKeyboard;

    @property({type: Prefab})
    enemyBase!: Prefab;

    @property({type: Node})
    fatigue!: Node;

    @property({type: ProgressBar})
    fatigueProgressUI!: ProgressBar;
    @property({type: Sprite})
    fatigueProgressBarSprite!: Sprite;

    @property({type: SwitchType})
    switchType: SwitchType = SwitchType.blue;

    playerHP: number = Settings.initialHP;
    // 피로도 게이지는 0부터 키를 입력할때마다 찬다.
    // 피로도가 임계치보다 넘어가면 키를 입력하지 못한다.
    // 피로도는 계속 내려간다.
    _fatigueGauge: number = 0;
    get fatigueGauge() {
        return this._fatigueGauge;
    }
    set fatigueGauge(value) {
        this._fatigueGauge = Math.max(0, value);
        this.fatigueProgressUI.progress = this._fatigueGauge / 100;
    }
    switchData!: SwitchData;

    private gameState: GameState = GameState.INIT;

    get GameState() {
        return this.gameState;
    }

    get HPText() {
        return `<color=#00ff00>HP:</color> <color=#990000>${this.playerHP}</color>`
    }

    set GameState(value) {
        if (this.gameState != value) {
            this.gameState = value;
            switch (this.gameState) {
                case GameState.READY:
                    this.hpText.string = `<color=#00ff00>Press any key to start</color>`;
                    this.fatigue.active = false;
                    break;
                case GameState.PLAYING:
                    this.hpText.string = this.HPText;
                    this.fatigue.active = true;
                    this.schedule(this.spawnEnemy.bind(this), 1);
                    this.schedule(this.fatigueDecrement.bind(this), 0.1);
                    break;
                case GameState.END:
                    this.unscheduleAllCallbacks();
                    this.targetEnemies.forEach((enemy) => {
                        enemy.node.destroy();
                    });
                    this.player.dead();
                    this.scheduleOnce(() => {
                        director.loadScene('GameTitle');
                    }, 1);
                    break;
                default: break;
            }
        }
    }

    private targetEnemies: Enemy[] = [];
    private _isRecover: boolean = false;
    get isRecover() {
        return this._isRecover;
    }
    set isRecover(value) {
        this._isRecover = value;
        this.fatigueProgressBarSprite.color = this._isRecover ? new Color("#ee2222") : new Color("#ffffff");
    }

    start() {
        this.switchData = Settings.switchData[SwitchType[this.switchType]];

        this.keyboard.addKeyHandler((keyCode) => {
            if (this.GameState == GameState.READY) {
                this.GameState = GameState.PLAYING;
                return;
            }
            if (this.GameState != GameState.PLAYING) return;
            if (this.fatigueGauge >= this.switchData.fatigueLimitation) {
                this.isRecover = true;
                return;
            }
            if (this.isRecover) return;

            this.checkEnemyHit(keyCode);
            this.player.attack();
        });

        this.GameState = GameState.READY;

        // if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.enable = true;
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
    }

    checkEnemyHit(keyCode: KeyCode) {
        let hitCheck = false;
        if (this.targetEnemies.length > 0) {
            const enemy = this.targetEnemies[0];
            if (enemy.getTargetKey() === keyCode) {
                hitCheck = true;
                enemy.Hit();
                this.targetEnemies.shift();
            }
        }
        this.fatigueGauge += (hitCheck ? this.switchData.fatigueTypeCorrect : this.switchData.fatigueTypeFailed);
    }

    spawnEnemy() {
        if (GameState.PLAYING != this.GameState) return;
        const enemy = instantiate(this.enemyBase);
        enemy.parent = this.node;
        const enemyScript = enemy.getComponent<Enemy>(Enemy);
        enemyScript.setTargetKey(this.keyboard.getRandomKeyCode());
        enemyScript.arrivedCallback = (enemy) => {
            this.playerHP -= 1;
            this.hpText.string = this.HPText;
            this.keyboard.missKey(enemy.getTargetKey());
            const index = this.targetEnemies.findIndex((e) => e === enemy);
            this.targetEnemies.splice(index, 1);

            if (this.playerHP <= 0) {
                this.GameState = GameState.END;
            }
        }
        this.targetEnemies.push(enemyScript);
    }

    fatigueDecrement() {
        this.fatigueGauge -= this.switchData.fatigueDecrement;
        if (this.isRecover) {
            this.isRecover = this.fatigueGauge > this.switchData.fatigueRecoverLevel;
        }
    }

    // onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     // will be called once when two colliders begin to contact
    //     console.log('onBeginContact');
    // }
    // onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     // will be called once when the contact between two colliders just about to end.
    //     console.log('onEndContact');
    // }
}

