import { _decorator, Component, log, Node, Sprite, tween, Tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('EffectShadow')
@requireComponent([UIOpacity, Sprite])
export class EffectShadow extends Component {

    @property(Node)
    public targetNode: Node;

    @property
    public yOffset: number = 10;

    @property(Vec2)
    public opacityRange: Vec2 = new Vec2();

    @property(Vec2)
    public moveRange: Vec2 = new Vec2();

    @property
    public followXPosition: boolean = true;

    @property
    public playOnStart: boolean = true;

    private _initialY: number;
    private _previousY: number;
    private _previousX: number;
    private _xOffset: number;

    private _moveRatio: number; // how much px is equal to 1% movement
    private _opactiyRatio: number; // how much opicity is equal to 1% movement

    private _stopped: boolean = false;

    start() {
        this._initialY = this._previousY = this.targetNode.position.y;
        this._moveRatio = (this.moveRange.x - this.moveRange.y) / 100;
        this._opactiyRatio = (this.opacityRange.x - this.opacityRange.y) / 100;

        if (this.followXPosition) {
            this._previousX = this.targetNode.position.x;
            this._xOffset = this.targetNode.position.x - this.node.position.x;
        }

        if (this.playOnStart) {
            this.play();
        }

    }

    update(deltaTime: number) {
        if (EDITOR) {
            //log("OKKKK");
        }

        if (this._stopped) {
            return;
        }

        if (this._previousY != this.targetNode.position.y) {
            this.play();
        }

        if (this._previousX != this.targetNode.position.x) {
            // move the shadow to follow target 
            this._previousX = this.targetNode.position.x;
            this.node.setPosition(this.targetNode.position.x - this._xOffset, this.node.position.y);
        }
    }

    play() {
        this._stopped = false;
        let currentY = this.targetNode.position.y;
        let movementY = currentY - this._initialY + this.yOffset;

        let movementPercent = movementY / this._moveRatio;
        let opacityAdj = movementPercent * this._opactiyRatio;


        let opacityVal = this.opacityRange.x - opacityAdj;
        this.getComponent(UIOpacity).opacity = (opacityVal > this.opacityRange.x) ? this.opacityRange.x : opacityVal;

        if (EDITOR) {
            //log(movementY + ", " + movementPercent + ", " + opacityAdj + ", " + opacityVal);
        }

        this._previousY = currentY;
    }

    stop() {
        this._stopped = true;
    }

    onDisable() {
        this.stop();
    }

    onLostFocusInEditor(): void {
        //log("testing:", this.targetNode.position.y);

        if (EDITOR) {
            this._initialY = this._previousY = this.targetNode.position.y;
            this._moveRatio = (this.moveRange.x - this.moveRange.y) / 100;
            this._opactiyRatio = (this.opacityRange.x - this.opacityRange.y) / 100;
            this.play();
        }
    }

    onFocusInEditor(): void {
        if (EDITOR) {
            this._initialY = this._previousY = this.targetNode.position.y;
            this._moveRatio = (this.moveRange.x - this.moveRange.y) / 100;
            this._opactiyRatio = (this.opacityRange.x - this.opacityRange.y) / 100;
            this.play();
        }
    }

    show(){
        this.node.active = true;
    }

    hide(){
        this.node.active = false;
    }
    
    protected onDestroy(): void {
        console.warn("onDestory called")
        this.node.destroy();
    }
}

