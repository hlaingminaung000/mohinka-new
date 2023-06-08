import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, ERigidBody2DType, Event, EventHandler, EventTouch, Input, IPhysics2DContact, Node, Prefab, Rect, RigidBody2D, size, Size, tween, UITransform, Vec2, Vec3, Vec4, find, sp, AudioSource } from "cc";
import { dropController } from "./dropController";
import { EffectFloating } from "./EffectFloating";
const { ccclass, property, requireComponent } = _decorator;
@ccclass("dragController")
@requireComponent([BoxCollider2D, RigidBody2D])


export class dragController extends Component {
    private initPos: Vec3 = new Vec3();
    private isDragging: boolean = false;
    private isRightAnswer: boolean = false;
    private offset: Vec3 = new Vec3();
    private rect: any = new Rect();
    private isContact: Boolean = false;
    private otherNode: Node = null!;
    private uiTransformComponent: any;
    private isLock: boolean = false;

    @property
    public autoConfigCollider: boolean = true;
    @property
    public returnToInitPosition: boolean = true;
    @property
    public snapToTarget: boolean = true;
    @property
    public colliderTag: number = 0;
    @property
    public colliderSize: Size = new Size(100,100);

    @property
    public lockWhenDragEndWithSameTag: boolean = true;    
    // for releasing on right answer
    @property({ type: [EventHandler] })
    public onDragEndWithSameTag: EventHandler[] = [];

    @property({ type: [EventHandler] })
    public onDragStart: EventHandler[] = [];

    @property({ type: [EventHandler] })
    public onDragMove: EventHandler[] = [];

    @property({ type: [EventHandler] })
    public onDragEnd: EventHandler[] = [];

    // for touching with right answer
    @property({ type: [EventHandler] })
    public onCollideWithSameTag: EventHandler[] = [];

    // for touching with wrong answer
    @property({ type: [EventHandler] })
    public onCollideWithDiffTag: EventHandler[] = [];

    // after touch with another obj ended
    @property({ type: [EventHandler] })
    public onCollideEnd: EventHandler[] = [];

    // returnToInitPosition
    @property({ type: [EventHandler] })
    public onReachedInitPosition: EventHandler[] = [];

    private returingToInit = false;


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
        self.initPos = self.node.getPosition();
        if (this.autoConfigCollider) {
            let c = this.node.getComponent(BoxCollider2D);
            let r = this.node.getComponent(RigidBody2D);

            c.tag = this.colliderTag;
            c.sensor = true;
            c.size = this.colliderSize;

            r.enabledContactListener = true;
            r.type = ERigidBody2DType.Dynamic;
            r.allowSleep = false;
            r.gravityScale = 0;
        }
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if(this.returingToInit == true) return;
        let self = this;
        console.log("onTouchStart")
        self.node.getComponent(EffectFloating).stop()

        if(self.isLock){
            return;
        }

        const touchPos = event.touch.getUILocation();
        const touchPosAR = new Vec3(touchPos.x, touchPos.y, 0);
        const nodeSize = self.uiTransformComponent.contentSize;
        self.rect.width = nodeSize.width;
        self.rect.height = nodeSize.height;
        self.isDragging = true;
        self.offset = touchPosAR.clone().subtract(new Vec3(this.node.position.x, this.node.position.y, 0));
        self.onDragStart.forEach((e: EventHandler) => {
            e.emit([]);
        });
    }

    onTouchMove(event: EventTouch) {
        if(this.returingToInit == true) return;
        console.log("onTouchMove")
        let self = this;
        self.node.parent.children[0].active = false;
        if (!this.isDragging) {
            return;
        }
        const touch = event.touch;
        const touchPos = touch.getUILocation();
        // console.log("touchPos", touchPos);
        const touchPosAR = new Vec3(touchPos.x, touchPos.y, 0);
        this.node.position = touchPosAR.clone()
            .subtract(this.offset);
        self.onDragMove.forEach((e: EventHandler) => {
            e.emit([]);
        });
    }

    onTouchEnd(event: EventTouch) {
        console.log("onTouchEnd")
        
        let self = this;
        
        if (!this.isDragging) {
            return;
        }
        
        this.isDragging = false;
        self.onDragEnd.forEach((e: EventHandler) => {
            e.emit([self]);
        });
        console.log("onTouchEnd:", self.isContact);
        if (self.isContact == false) {
            self._returnToInitPos();
        } else {
            
            if (self.isRightAnswer) {
                this.onDestroy()

                if(self.lockWhenDragEndWithSameTag){
                    self.lockDrag();
                }
                if (self.snapToTarget) {
                    self.setToRightObjectPos(self.otherNode.worldPosition);
                }
                self.onDragEndWithSameTag.forEach((e: EventHandler) => {
                    e.emit([]);
                });

                const boxColliderComponent = this.node.getComponent(BoxCollider2D);
                boxColliderComponent.destroy();
            } else {
                console.log("drag: diff ans");
                self._returnToInitPos();
                
            }

            let dropCtrl: dropController = self.otherNode.getComponent(dropController);
            if (dropCtrl) {
                dropCtrl.onDropped(self);
            }

        }
        // skeletonComponentOfElephant.animation = 'idle'
        // skeletonComponentOfElephant.loop = true;
    }

    onTouchCancel(event: EventTouch) {
        let self = this;
        self.isDragging = false;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let self = this;
        self.isContact = true;
        self.otherNode = otherCollider.node;
        if (selfCollider.tag === otherCollider.tag) {
            self.isRightAnswer = true;
            self.onCollideWithSameTag.forEach((e: EventHandler) => {
                e.emit([]);
            });
        } else {
            self.isRightAnswer = false;
            self.onCollideWithDiffTag.forEach((e: EventHandler) => {
                e.emit([]);
            });
        }
    }

    onEndContact() {
        let self = this;
        self.isContact = false;
        self.isRightAnswer = false;
        self.onCollideEnd.forEach((e: EventHandler) => {
            e.emit([]);
        });
    }

    _returnToInitPos() {
        this.returingToInit = true;
        let self = this;
        self.node.parent.children[0].active = true;
        if (!this.returnToInitPosition) {
            return;
        }
        tween(self.node)
            .to(0.25, {
                position: new Vec3(self.initPos),
            })
            .call( ()=>{
                // onReachedInitPosition
                self.onReachedInitPosition.forEach((e: EventHandler) => {
                    e.emit([]);
                });
                self.node.getComponent(EffectFloating).play()
                this.returingToInit = false
            })
            .start();
    }

    setToRightObjectPos(objPos: Vec3) {
        // TODO: we need to fix this (if the traget and self is nested under parents)
        let self = this;
        tween(self.node)
            .to(0.2, {
                worldPosition: new Vec3(objPos),
            })
            .start();

    }

    lockDrag(){
        this.isLock = true;
    }

    unlockDrag(){
        this.isLock = false;
    }
}
