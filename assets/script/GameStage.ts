import { _decorator, Collider2D, Component, Contact2DType, director, instantiate, IPhysics2DContact, KeyCode, Node, PhysicsSystem2D, Prefab, RichText } from 'cc';
import { UIKeyboard } from './UIKeyboard';
import { GamePlayer } from './GamePlayer';
import { Enemy } from './Enemy';
import { Settings } from './Settings';
const { ccclass, property } = _decorator;


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

    playerHP: number = Settings.initialHP;

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
                    break;
                case GameState.PLAYING:
                    this.hpText.string = this.HPText;
                    this.schedule(this.spawnEnemy.bind(this), 1);
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

    start() {
        this.keyboard.addKeyHandler((keyCode) => {
            if (this.GameState == GameState.READY) {
                this.GameState = GameState.PLAYING;
                return;
            }
            if (this.GameState != GameState.PLAYING) return;
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
        if (this.targetEnemies.length > 0) {
            const enemy = this.targetEnemies[0];
            if (enemy.getTargetKey() === keyCode) {
                enemy.Hit();
                this.targetEnemies.shift();
            }
        }
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

    // onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     // will be called once when two colliders begin to contact
    //     console.log('onBeginContact');
    // }
    // onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     // will be called once when the contact between two colliders just about to end.
    //     console.log('onEndContact');
    // }
}

