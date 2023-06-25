import { _decorator, Button, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIKey')
export class UIKey extends Button {

    @property({type: Label})
    public missLabel: Label;

    private _missCount = 0;
    get missCount() {
        return this._missCount;
    }
    set missCount(value) {
        this._missCount = value;
        this.missLabel && (this.missLabel.string = `Miss ${this.missCount}`);
    }

    start() {
        this.missCount = 0;
    }

    update(deltaTime: number) {

    }

    public _applyTransition(state: string) {
        super._applyTransition(state);
    }
}


