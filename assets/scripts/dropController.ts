import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, EventHandler, IPhysics2DContact, Node, Size, tween, Vec3, } from "cc";
import { dragController } from "./dragController";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("dropController")
@requireComponent(BoxCollider2D)
export class dropController extends Component {

    @property
    public autoConfigCollider: boolean = true;

    @property
    public colliderTag: number = 0;
    @property
    public colliderSize: Size = new Size(100, 100);

    // for touching with right answer
    @property({ type: [EventHandler] })
    public onCollideWithSameTag: EventHandler[] = [];

    // for touching with wrong answer
    @property({ type: [EventHandler] })
    public onCollideWithDiffTag: EventHandler[] = [];

    // after touch with another obj ended
    @property({ type: [EventHandler] })
    public onCollideEnd: EventHandler[] = [];

    // for releasing on right answer 
    // NOTE: Not possible because we cant know whether the item is dropped or still dragging
    // NOTE 2: Drag Controller is passing the other node to here
    @property({ type: [EventHandler] })
    public onDropEndWithSameTag: EventHandler[] = [];

    @property({ type: [EventHandler] })
    public onDropEndWithDiffTag: EventHandler[] = [];

    onLoad() {
        let self = this;

        let collider = self.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
            collider.on(Contact2DType.END_CONTACT, self.onEndContact, self);
        }

        if (this.autoConfigCollider) {
            let c = this.node.getComponent(BoxCollider2D);
            c.tag = this.colliderTag;
            c.sensor = true;
            // c.size = this.colliderSize;
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let self = this;

        if (selfCollider.tag === otherCollider.tag) {
            //self.isRightAnswer = true;

            self.onCollideWithSameTag.forEach((e: EventHandler) => {
                e.emit([]);
            });
        } else {
            //self.isRightAnswer = false;

            self.onCollideWithDiffTag.forEach((e: EventHandler) => {
                e.emit([]);
            });
        }
    }

    onEndContact() {
        let self = this;
        self.onCollideEnd.forEach((e: EventHandler) => {
            e.emit([]);
        });
    }

    onDropped(dragCtrl: dragController) {
        let otherCollider: Collider2D = dragCtrl.node.getComponent(Collider2D);
        let selfCollider: Collider2D = this.node.getComponent(Collider2D);
        if (otherCollider) {
            if (otherCollider.tag === selfCollider.tag) {
                console.log("onDropped: same tag")
                this.onDropEndWithSameTag.forEach((e: EventHandler) => {
                    e.emit([]);
                });

                // TODO: remmove this after snap fixed 
                // dragCtrl.node.destroy();
            } else {
                console.log("onDropped: diff tag")
                this.onDropEndWithDiffTag.forEach((e: EventHandler) => {
                    e.emit([]);
                });
            }
        }
    }
}
