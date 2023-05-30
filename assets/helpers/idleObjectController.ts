import {
  _decorator,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Node,
  tween,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("idleObjectController")
export class idleObjectController extends Component {
  private initPos: Vec3 = new Vec3();
  private objPos: Vec3 = new Vec3();

  private isContact: Boolean;
  private selfTag: number;
  private otherTag: number;
  private isRightAnswer: boolean;
  private scaleController: any;

  onLoad() {
    let self = this;

    let collider = self.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
      collider.on(Contact2DType.END_CONTACT, self.onEndContact, self);
    }

    self.scaleController = self.node.getComponent("scaleController");
    self.init();
  }

  init() {
    let self = this;

    // self.node.getPosition(self.initPos);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    let self = this;

    self.isContact = true;
    self.selfTag = selfCollider.tag;
    self.otherTag = otherCollider.tag;
    self.checkResult(self.selfTag, self.otherTag);
    self.scaleController.playScaleUpAnimation();
  }

  checkResult(myTag: number, otherID: number) {
    let self = this;

    if (myTag == otherID) {
      console.log("Right Answer");
      self.isRightAnswer = true;
    } else {
      console.log("Wrong Answer");
      self.isRightAnswer = false;
    }
  }

  onEndContact() {
    let self = this;

    self.isContact = false;
    self.scaleController.playScaleInitAnimation();
  }
}
