import { _decorator, Component, Node, tween, Tween, TweenAction, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EffectFloating')
export class EffectFloating extends Component {

    @property
    public yMovement: number = 10;

    @property
    public duration: number = 2;

    @property
    public playOnStart: boolean = true;

    private _initPosition: Vec3 = null;

    start() {
        if (this.playOnStart) {
            this.play();
        }

        this._initPosition = new Vec3(0, 0, 0);
        this._initPosition = this.node.getPosition();

        console.log(this._initPosition, this.node.getPosition());
    }

    update(deltaTime: number) {

    }

    play() {
        if (this._initPosition != null){
            this.node.setPosition(this._initPosition);
        }
        let up = tween(this.node).by(this.duration, { position: new Vec3(0, this.yMovement, 0) }, { easing: "smooth" });
        let down = tween(this.node).by(this.duration, { position: new Vec3(0, this.yMovement * -1, 0) }, { easing: "smooth" });

        let t = tween(this.node).sequence(up, down).repeatForever().start();
    }

    stop() {
        if (this._initPosition != null) {
            this.node.setPosition(this._initPosition);
        }
        Tween.stopAllByTarget(this.node);
    }

    onDisable() {
        this.stop();
    }
}

