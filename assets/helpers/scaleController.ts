import {
  _decorator,
  CCBoolean,
  CCFloat,
  Component,
  Node,
  tween,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("scaleController")
export class scaleController extends Component {
  @property(CCFloat)
  public duration: number = 0;

  @property(Vec3)
  public initScale: Vec3 = new Vec3();

  @property(Vec3)
  public newScale: Vec3 = new Vec3();

  @property(CCBoolean)
  public playOnLoad: boolean = false;

  onLoad() {
    let self = this;

    if (self.playOnLoad === true) {
      self.playScaleUpAnimation();
    }

    self.init();
  }

  init() {
    let self = this;

    self.node.setScale(self.initScale);
  }

  playScaleUpAnimation() {
    let self = this;

    tween(self.node)
      .to(self.duration, {
        scale: self.newScale,
      })
      .start();
  }

  playScaleInitAnimation() {
    let self = this;

    tween(self.node)
      .to(self.duration, {
        scale: self.initScale,
      })
      .start();
  }

  update(dt: number) {}
}
