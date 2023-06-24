import { _decorator, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, KeyCode, Node, PhysicsSystem2D, Prefab } from 'cc';
import { UIKeyboard } from './UIKeyboard';
import { Player } from './Player';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;


enum GameState {
    READY = 0,
    PLAYING = 1,
    END = 2
}

@ccclass('GameStage')
export class GameStage extends Component {


    @property({type: UIKeyboard})
    keyboard!: UIKeyboard;
    @property({type: Player})
    player!: Player;
    @property({type: Node})
    spawnPlace!: UIKeyboard;

    @property({type: Prefab})
    enemyBase!: Prefab;


    // gameState: GameState = GameState.READY;

    private targetEnemies: Enemy[] = [];


    start() {
        this.keyboard.addKeyHandler((keyCode) => {
            this.checkEnemyHit(keyCode);
            this.player.attack();
        });

        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.enable = true;
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.schedule(() => {
            this.spawnEnemy();
        }, 1);
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
        const enemy = instantiate(this.enemyBase);
        enemy.parent = this.node;
        const enemyScript = enemy.getComponent<Enemy>(Enemy);
        enemyScript.setTargetKey(this.keyboard.getRandomKeyCode());
        enemyScript.arrivedCallback = (enemy) => {
            const index = this.targetEnemies.findIndex((e) => e === enemy);
            this.targetEnemies.splice(index, 1);
        }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        console.log('onBeginContact');
        this.targetEnemies.push(otherCollider.node.getComponent<Enemy>(Enemy));
    }
    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when the contact between two colliders just about to end.
        console.log('onEndContact');
    }
}

