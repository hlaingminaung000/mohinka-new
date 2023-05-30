
let state = {
  step : 1,
  rightMark: 0
}

import {
  _decorator,
  BoxCollider2D,
  Collider2D,
  Component,
  Contact2DType,
  director,
  Event,
  EventHandler,
  EventTouch,
  Input,
  IPhysics2DContact,
  Node,
  Rect,
  RigidBody2D,
  tween,
  UITransform,
  Vec2,
  Vec3,
  Vec4,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("dndController")
export class dndController extends Component {
  private initPos: Vec3 = new Vec3();
  private objPos: Vec3 = new Vec3();
  private isDragging: boolean = false;
  private offset: Vec3 = new Vec3();
  private rect: any = new Rect();
  private isContact: Boolean = false;
  private otherNode: Node = null!;
  private uiTransformComponent: any;
  @property (Node)
  step : Node ;
  
  start (){
    console.log("start---------------")
  }
  


  onLoad() {
    let self = this;

    self.node.on(Input.EventType.TOUCH_START, self.onTouchStart, self);
    self.node.on(Input.EventType.TOUCH_MOVE, self.onTouchMove, self);
    self.node.on(Input.EventType.TOUCH_END, self.onTouchEnd, self);

    let collider = self.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, self.onBeginContact, self);
      collider.on(Contact2DType.END_CONTACT, self.onEndContact, self);
    }

    self.init();
    self.uiTransformComponent = self.node.getComponent("cc.UITransform");
    
  }

  init() {
    let self = this;

    self.node.getPosition(self.initPos);
    // console.log(self.initPos);
  }

  onDestroy() {
    this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchStart(event: EventTouch) {
    let self = this;

    const touchPos = event.touch.getUILocation();
    const touchPosAR = new Vec3(touchPos.x, touchPos.y, 0);
    const nodeSize = self.uiTransformComponent.contentSize;
    self.rect.width = nodeSize.width;
    self.rect.height = nodeSize.height;
    self.isDragging = true;
    self.offset = touchPosAR
      .clone()
      .subtract(new Vec3(this.node.position.x, this.node.position.y, 0));
    // console.log("offset", this.offset);
  }

  onTouchMove(event: EventTouch) {
    let self = this;

    if (!this.isDragging) {
      return;
    }
    const touch = event.touch;
    const touchPos = touch.getUILocation();
    // console.log("touchPos", touchPos);

    const touchPosAR = new Vec3(touchPos.x, touchPos.y, 0);

    this.node.position = touchPosAR.clone().subtract(this.offset);
    // console.log(self.node.getPosition());
  }

  onTouchEnd(event: EventTouch) {
    let self = this;

    this.isDragging = false;

    // console.log(self.isContact);
    if (self.isContact == false) {
      self.returnToInitPos();
    } else {
      console.log(`self.otherNode`,self.otherNode)
      let obj: any = self.otherNode.getComponent("idleObjectController");
      console.log("obj",obj)
      self.otherNode.getPosition(self.objPos);
      if (obj.isRightAnswer) {
        self.setToRightObjectPos(self.objPos);
        const boxColliderComponent = this.node.getComponent(BoxCollider2D);
        boxColliderComponent.destroy();
        // rigidBodyComponent.destroy ;
        // const collider = this.getComponent(Collider2D);
        // collider.destroy ;
        state.rightMark = state.rightMark + 1
        if(state.rightMark == 2){
          state.rightMark = 0;
          this.step.active = true; 
          state.step += 1;
        }
      } else {
        self.returnToInitPos();
      }
    }
  }

  onTouchCancel(event: EventTouch) {
    let self = this;

    self.isDragging = false;
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    let self = this;
    self.isContact = true;
    self.otherNode = otherCollider.node;
  }

  onEndContact() {
    let self = this;

    self.isContact = false;
  }

  returnToInitPos() {
    let self = this;

    tween(self.node)
      .to(0.25, {
        position: new Vec3(self.initPos),
      })
      .start();
  }

  setToRightObjectPos(objPos: Vec3) {
    let self = this;

    tween(self.node)
      .to(0.2, {
        position: new Vec3(objPos),
      })
      .start();

    self.node.getComponent(dndController).destroy();
  }
}
