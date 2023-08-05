import { _decorator, Button, Component, EventHandler, Node, ProgressBar, Toggle, ToggleContainer } from 'cc';
import { Settings, SwitchData, SwitchType } from './Settings';
import { GameStage, GameState } from './GameStage';
const { ccclass, property } = _decorator;

@ccclass('PopupSwitchSelect')
export class PopupSwitchSelect extends Component {

    @property({type: GameStage})
    stage!: GameStage;

    @property({type: ToggleContainer})
    toggleContainer: ToggleContainer;

    @property({type: Button})
    btnSelect: Button;

    @property({type: ProgressBar})
    progressBars: ProgressBar[] = [];

    switchType: SwitchType = SwitchType.blue;

    onLoad() {
        if (this.btnSelect) {
            this.btnSelect.node.on(Button.EventType.CLICK, () => {
                this.node.destroy();
                this.stage.startStage(this.switchType);
            }, this);
        }

        const containerEventHandler = new EventHandler();
        // This Node is the node to which your event processing code component belongs
        containerEventHandler.target = this.node;
        // This is the script class name
        containerEventHandler.component = 'PopupSwitchSelect';
        containerEventHandler.handler = 'switchSelected';

        this.toggleContainer.checkEvents.push(containerEventHandler);

        this.toggleContainer.notifyToggleCheck(this.toggleContainer.toggleItems[0]);
    }

    switchSelected(toggle: Toggle) {

        const switchTypeStrings = [
            SwitchType[SwitchType.blue],
            SwitchType[SwitchType.red],
            SwitchType[SwitchType.brown],
            SwitchType[SwitchType.non_contact],
        ];

        const matchSwitch = switchTypeStrings.find(x => toggle.name.startsWith(x));

        // console.log(matchSwitch);

        const switchData: SwitchData = Settings.switchData[matchSwitch];

        this.progressBars[0].progress = switchData.fatigueLimitation / 100;
        this.progressBars[1].progress = switchData.fatigueDecrement / 3;
        this.progressBars[2].progress = switchData.fatigueTypeCorrect / 10;
        this.progressBars[3].progress = switchData.fatigueTypeFailed / 12;
        this.progressBars[4].progress = switchData.fatigueRecoverLevel / 100;
    }
}


