import {
  _decorator,
  Component,
  Node,
  Skeleton,
  Vec3,
  sp,
  tween,
  ParticleSystem2D,
  PhysicsSystem2D,
  EPhysics2DDrawFlags,
  Color,
  v2,
  AudioSource,
  game,
  Sprite,
  UIOpacity,
  ParticleSystemComponent,
} from "cc";
import { AudioClipNames, AudioHelper } from "./helperAudio";
import { EffectShadow } from "./EffectShadow";
const { ccclass, property } = _decorator;

@ccclass("mainController")
export class mainController extends Component {
  @property({ type: Node })
  public steps: Node[] = [];

  @property({ type: Node })
  public elephant: Node = null;

  @property({ type: Node })
  public bird: Node = null;

  @property({ type: Node })
  public bigCup: Node = null;

  @property({ type: Node })
  public smallCup: Node = null;

  @property({ type: Node })
  public logoPlacement: Node = null;

  state = {
    foodNum: [1, 2],
    step: 1,
    rightMark: 0,
  };

  onLoad() {
    const self = this;
    this.goToNextStep(self, self.state.step);
    self.node.getComponent(AudioHelper).play(AudioClipNames.bg);
    const skeletonComponentOfElephant = self.elephant.getComponent(sp.Skeleton);
    const skeletonComponentOfBird = self.bird.getComponent(sp.Skeleton);
    skeletonComponentOfElephant.animation = "idle";
    skeletonComponentOfBird.animation = "idle";

    tween(self.logoPlacement)
      .to(1, { position: new Vec3(352, 222, 0) })
      .start();

    // PhysicsSystem2D.instance.debugDrawFlags =
    //         EPhysics2DDrawFlags.Aabb |
    //         EPhysics2DDrawFlags.Pair |
    //         EPhysics2DDrawFlags.CenterOfMass |
    //         EPhysics2DDrawFlags.Joint |
    //         EPhysics2DDrawFlags.Shape;
  }

  public goToNextStep(self, step) {

    const index = step - 1;
    const randomNum1 = self.getRandomNumber(self.state.foodNum);
    const filteredArray = self.state.foodNum.filter((num) => randomNum1 != num);
    const randomNum2 = self.getRandomNumber(filteredArray);

    const leftFoodNode = self.steps[index].children[randomNum1 - 1].children[1];
    const rightFoodNode = self.steps[index].children[randomNum2 - 1].children[1];

    const leftFoodShadow = self.steps[index].children[randomNum1 - 1].children[0];
    const rightFoodShadow = self.steps[index].children[randomNum2 - 1].children[0];

    leftFoodNode.setPosition(new Vec3(-128, 6));
    rightFoodNode.setPosition(new Vec3(74, -0.6));
    const { x: leftX, y: leftY,shadowScale: leftShadowScale } = self.getShowdowPostition(leftFoodNode, step);
    const { x: rightX, y: rightY,shadowScale: rightShadowScale } = self.getShowdowPostition(rightFoodNode,step);

    leftFoodShadow.setPosition(new Vec3(leftX, leftY));
    rightFoodShadow.setPosition(new Vec3(rightX, rightY));
    leftFoodShadow.scale = new Vec3(leftShadowScale,rightShadowScale,0);
    rightFoodShadow.scale = new Vec3(rightShadowScale,rightShadowScale,0);

    const originalScaleForLeftFood = leftFoodNode.scale.clone();
    const originalScaleForRightFood = rightFoodNode.scale.clone();

    leftFoodNode.scale = new Vec3(0, 0, 0);
    rightFoodNode.scale = new Vec3(0, 0, 0);

    leftFoodNode.active = true;
    rightFoodNode.active = true;

    tween(leftFoodNode)
      .to(1, { scale: originalScaleForLeftFood })
      .call(() => (leftFoodShadow.active = true))
      .start();

    tween(rightFoodNode)
      .to(1, { scale: originalScaleForRightFood })
      .call(() => (rightFoodShadow.active = true))
      .start();

  }

  public animation(dragNode) {
    const self = this;
    const goToNextStep = self.goToNextStep;
    const audioHelper = self.node.getComponent(AudioHelper);

    const eatAudio = self.node.getComponent(AudioHelper).soundEat;
    const waterDropAudio = self.node.getComponent(AudioHelper).waterDrop;

    const skeletonComponentOfElephant = self.elephant.getComponent(sp.Skeleton);
    const skeletonComponentOfBird = self.bird.getComponent(sp.Skeleton);

    if (dragNode.isContact == true) {
        const otherNodeXD = dragNode.otherNode.getWorldPosition().x;
        const otherNodeYD = dragNode.otherNode.getWorldPosition().y;
        let skeletonComponent;
        if (dragNode.otherNode.name == "bigCup") {
            skeletonComponent = skeletonComponentOfElephant;
        }else{
            skeletonComponent = skeletonComponentOfBird
        }

        skeletonComponent.loop = false;
    
        if (dragNode.isRightAnswer) {
            skeletonComponent.animation = "laugh";
            audioHelper.play(AudioClipNames.laugh)
        } else {
            skeletonComponent.animation = "angry";
            audioHelper.play(AudioClipNames.angry)
        }
        skeletonComponent.setCompleteListener((value) => {
            if (value.animation.name == "dance") {
            skeletonComponent.loop = true;
            } else {
            skeletonComponent.animation = "idle";
            skeletonComponent.loop = true;
            }
        });
      
      if (dragNode.isRightAnswer) {
        this.state.rightMark = this.state.rightMark + 1;

        if (this.state.step == 1) {
          const hinYayNode = dragNode.otherNode.children.filter((v) => v.name == "hinYay")[0];
          const particle = dragNode.otherNode.children
            .filter((v) => v.name == "particle")[0]
            .getComponent(ParticleSystem2D);
          const steam = dragNode.otherNode.children.filter((v) => v.name == "steam")[0];
          let xD;let yD;let w;let h;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD + 60;
            yD = otherNodeYD + 110;
            w = 363;
            h = 100; // w = 'hinyay width // h= 'hinyay height
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD + 50;
            yD = otherNodeYD + 100;
            w = 363;
            h = 100;
          }
          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
                dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
            })
            .to(0.6, { angle: 18 })
            .call(() => {
            //   audioHelper.play(AudioClipNames.waterDrop)
              waterDropAudio.play();
              waterDropAudio.setLoop(true);
              particle.resetSystem();
              tween(hinYayNode)
                .to(1.5, { width: w, height: h })
                .call(() => {
                //  audioHelper.stop("waterDrop")
                  waterDropAudio.stop()
                  particle.stopSystem();
                  tween(dragNode.node)
                    .to(0.2, { scale: new Vec3(0, 0, 0) })
                    .call(() => {
                      steam.getComponent(Sprite).enabled = true;
                      const action1 = tween(steam).to(1, {
                        width: 163,
                        height: 275,
                      });
                      const action2 = tween(steam).to(1, {
                        width: 163,
                        height: 275 - 50,
                      });
                      tween(steam)
                        .sequence(action1, action2)
                        .repeatForever()
                        .start();
                    })
                    .start();
                })
                .start();
            })
            .start();
        }

        if (this.state.step == 2) {
          const motePhatNode = dragNode.otherNode.children.filter((v) => v.name == "motePhat")[0];
          let xD;let yD;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }
          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
              dragNode.node.parent = motePhatNode;
              dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
              tween(motePhatNode).to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) }).start();
            })
            .to(0.6, { position: new Vec3(0, 0, 0) })
            .start();
        }

        if (this.state.step == 3) {
          const eggNode = dragNode.otherNode.children.filter((v) => v.name == "egg")[0];
          let xD;let yD;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }
          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
              dragNode.node.parent = eggNode;
              dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
              tween(eggNode).to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) }).start();
            })
            .parallel(
              tween().to(0.6, { position: new Vec3(0, 0, 0) }),
              tween().to(0.6, {
                scale: new Vec3(
                  dragNode.node.scale.x - 0.1,
                  dragNode.node.scale.y - 0.1,
                  0
                ),
              })
            )
            .start();
        }

        if (this.state.step == 4) {
          const pelKyawNote = dragNode.otherNode.children.filter((v) => v.name == "pelKyaw")[0];
          let xD;let yD;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }

          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
              dragNode.node.parent = pelKyawNote;
              dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
              tween(pelKyawNote).to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) }).start();
            })
            .to(0.6, { position: new Vec3(0, 0, 0) })
            .start();
        }

        if (this.state.step == 5) {
          const nanPinNode = dragNode.otherNode.children.filter((v) => v.name == "nanPin")[0];
          let xD;let yD;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
          }

          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
              dragNode.node.parent = nanPinNode;
              dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
              tween(nanPinNode).to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) }).start();
            })
            .to(0.6, { position: new Vec3(0, 0, 0) })
            .start();
        }

        if (this.state.step == 6) {
          const spoonNode = dragNode.otherNode.children.filter((v) => v.name == "spoon")[0];
          let xD;
          let yD;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD + 50;
            yD = otherNodeYD + 100;
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD + 50;
            yD = otherNodeYD + 100;
          }
          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
              dragNode.node.parent = spoonNode;
              dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
              tween(spoonNode).to(0.6, { scale: new Vec3(0.7, 0.7, 0.7) }).start();
            })
            .to(0.6, { position: new Vec3(0, 0, 0) })
            .start();
        }

        if (this.state.step == 7) {
          let xD;let yD;let bucketNode;let newScale;
          if (dragNode.node.name == "food1") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
            bucketNode = dragNode.otherNode.parent.children.filter((v) => v.name == "bigBucket")[0];
            newScale = new Vec3(dragNode.node.scale.x-0.3, dragNode.node.scale.y-0.3, 0);
          }
          if (dragNode.node.name == "food2") {
            xD = otherNodeXD;
            yD = otherNodeYD + 100;
            bucketNode = dragNode.otherNode.parent.children.filter((v) => v.name == "smallBucket")[0];
            newScale = new Vec3(dragNode.node.scale.x-0.1, dragNode.node.scale.y-0.1, 0);
          }

          tween(dragNode.node)
            .to(0.6, { worldPosition: new Vec3(xD, yD, 0) })
            .call(() => {
              dragNode.node.parent = bucketNode;
              dragNode.node.setWorldPosition(new Vec3(xD, yD, 0));
            })
            .parallel(
              tween().to(0.6, { position: new Vec3(0, 0, 0) }),
              tween().to(0.6, { scale: newScale })
            )
            .call(() => {
              afterSevenStep();
            })
            .start();
        }

        if (this.state.rightMark == 2) {
          if (this.state.step < 7) {
            this.state.rightMark = 0;
            this.state.step += 1;
            goToNextStep(self, this.state.step);
          }
        }
        const afterSevenStep = () => {
          if (this.state.rightMark == 2) {
            const bigCupNode = self.bigCup;
            const smallCupNode = self.smallCup;
            const elephantMouth = bigCupNode.children.filter((v) => v.name == "mouth")[0];
            const birdMouth = smallCupNode.children.filter((v) => v.name == "mouth")[0];
            const shadowForBigCup = bigCupNode.children.filter((v) => v.name == "shadow")[0];
            const shadowForSmallCup = smallCupNode.children.filter((v) => v.name == "shadow")[0];
            shadowForBigCup.active = false;
            shadowForSmallCup.active = false;
            // audioHelper.play(AudioClipNames.eat);
            eatAudio.play();
            tween(bigCupNode)
              .parallel(
                tween().to(2, {
                  worldPosition: elephantMouth.getWorldPosition(),
                }),
                tween().to(2, { scale: new Vec3(0.2, 0.2, 0) })
              )
              .call(() => {
                tween(bigCupNode.getComponent(UIOpacity))
                  .to(0.6, { opacity: 0 })
                  .call(() => {
                    skeletonComponentOfElephant.loop = true;
                    skeletonComponentOfElephant.animation = "dance";
                    // audioHelper.stop('soundEat')
                    eatAudio.stop();
                  })
                  .start();
              })
              .start();

            tween(smallCupNode)
              .parallel(
                tween().to(2, { worldPosition: birdMouth.getWorldPosition() }),
                tween().to(2, { scale: new Vec3(0.2, 0.2, 0) })
              )
              .call(() => {
                tween(smallCupNode.getComponent(UIOpacity))
                  .to(0.6, { opacity: 0 })
                  .call(() => {
                    skeletonComponentOfBird.loop = true;
                    skeletonComponentOfBird.animation = "dance";
                    audioHelper.play(AudioClipNames.win);
                  })
                  .start();
              })
              .start();
          }
        };
      }
    }
  }

  public getRandomNumber(array) {
    const numbersArray = [...array];
    const randomIndex = Math.floor(Math.random() * numbersArray.length);
    const randomNumber = numbersArray[randomIndex];

    return randomNumber;
  }

  getShowdowPostition(node, step) {
    let shadowXPosition;
    let shadowYPosition;
    let shadowScale;
    let nodeX = node.getPosition().x;
    let nodeY = node.getPosition().y;
    if (step == 1) {
      shadowXPosition =
        nodeX - (node.getContentSize().width / 3) * node.scale.x;
      shadowYPosition =
        nodeY - (node.getContentSize().height / 2) * node.scale.y;
      shadowScale = 1;
    } else if (step == 2 || step == 3 || step == 4) {
      shadowXPosition =
        nodeX - (node.getContentSize().width / 20) * node.scale.x;
      shadowYPosition =
        nodeY - (node.getContentSize().height / 2) * node.scale.y;
      if(step == 2 ) shadowScale = 2;
      if(step == 3 ) shadowScale = 1.5;
      if(step == 4) shadowScale = 1.5;
    } else if (step == 6) {
      shadowXPosition =
        nodeX - (node.getContentSize().width / 3) * node.scale.x;
      shadowYPosition =
        nodeY - (node.getContentSize().height / 2) * node.scale.y;
      shadowScale = 1;
    } else if (step == 7) {
      shadowXPosition =
        nodeX - (node.getContentSize().width / 14) * node.scale.x;
      shadowYPosition =
        nodeY - (node.getContentSize().height / 3) * node.scale.y;
      shadowScale = 1.5;
    } else {
      shadowXPosition =
        nodeX - (node.getContentSize().width / 6) * node.scale.x;
      shadowYPosition =
        nodeY - (node.getContentSize().height / 2) * node.scale.y;
      if(step == 5 ) shadowScale = 1.5;
    }
    return { x: shadowXPosition, y: shadowYPosition,shadowScale: shadowScale };
  }

  start() {}

  update(deltaTime: number) {}
}
