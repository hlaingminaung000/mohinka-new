import { _decorator, Component, Node, Skeleton, Vec3,sp, tween, ParticleSystem2D, Color, v2, AudioSource,game, Sprite, UIOpacity, ParticleSystemComponent } from 'cc';
import { AudioClipNames, AudioHelper } from './helperAudio';
import { EffectShadow } from './EffectShadow';
const { ccclass, property } = _decorator;


@ccclass('mainController')
export class mainController extends Component {
    @property({ type: Node})
    public steps : Node[] = [];

    
    @property({ type: Node})
    public elephant : Node = null;

    @property({ type: Node})
    public bird : Node = null;

    @property({ type: Node})
    public bigCup : Node = null;

    @property({ type: Node})
    public smallCup : Node = null;

    @property({ type: Node})
    public logoPlacement : Node = null;


    state = {
        foodNum : [1,2],
        step : 2,
        rightMark: 0
    }
    
    onLoad() {
        const self = this;
        this.goToNextStep(self,self.state.step)
        // self.node.getComponent(AudioHelper).play(AudioClipNames.bg);
        const skeletonComponentOfElephant = self.elephant.getComponent(sp.Skeleton);
        const skeletonComponentOfBird =  self.bird.getComponent(sp.Skeleton);
        skeletonComponentOfElephant.animation = "idle";
        skeletonComponentOfBird.animation = "idle";
 
        tween(self.logoPlacement)
        .to(1, {position: new Vec3(352,222,0)})
        .start();
        
    }

    public goToNextStep(self,step) {

        console.log("self",self)
        const index = step - 1;
        const randomNum1 = self.getRandomNumber(self.state.foodNum);
        const filteredArray = self.state.foodNum.filter((num)=> randomNum1 != num );
        const randomNum2 = self.getRandomNumber(filteredArray);

        const leftFoodNode = self.steps[index].children[randomNum1-1].children[1];
        const rightFoodNode = self.steps[index].children[randomNum2-1].children[1];

        const leftFoodShadow = self.steps[index].children[randomNum1-1].children[0];
        const rightFoodShadow = self.steps[index].children[randomNum2-1].children[0];

        leftFoodNode.setPosition(new Vec3(-128,5))
        rightFoodNode.setPosition(new Vec3(74,-0.6))
        const {x : leftX,y: leftY} = self.getShowdowPostition(leftFoodNode,step,-128,5)
        const {x : rightX,y: rightY} = self.getShowdowPostition(rightFoodNode,step,74,-0.6)

        leftFoodShadow.setPosition(new Vec3(leftX,leftY))
        rightFoodShadow.setPosition(new Vec3(rightX,rightY))

        const originalScaleForLeftFood = leftFoodNode.scale.clone()
        const originalScaleForRightFood = rightFoodNode.scale.clone()

        leftFoodNode.scale = new Vec3(0,0,0)
        rightFoodNode.scale = new Vec3(0,0,0)


        self.steps[index].active = true;
        self.steps[index].active = true;
        leftFoodNode.active = true ;
        rightFoodNode.active = true ;
        leftFoodShadow.active = true ;
        rightFoodShadow.active = true ;

        tween( leftFoodNode)
        .to(1, {scale: originalScaleForLeftFood})
        .start();

        tween( rightFoodNode)
        .to(1, {scale: originalScaleForRightFood})
        .start();
     
        
    }
    public animation(dragNode){
        console.log("dragNode",dragNode)
        const self = this;
        const goToNextStep = self.goToNextStep;
        const laughAudio  = self.node.getComponent(AudioHelper).soundLaugh;
        const angryAudio = self.node.getComponent(AudioHelper).soundMeow;
        const fireworkAudio = self.node.getComponent(AudioHelper).soundWin;
        const eatAudio = self.node.getComponent(AudioHelper).soundEat;

        const skeletonComponentOfElephant = self.elephant.getComponent(sp.Skeleton);
        const skeletonComponentOfBird =  self.bird.getComponent(sp.Skeleton);
        if(dragNode.isContact == true){
            if(dragNode.otherNode.name == 'bigCup'){
                skeletonComponentOfElephant.loop = false;
                angryAudio.stop();
                laughAudio.stop();
                if(dragNode.isRightAnswer){
                    skeletonComponentOfElephant.animation = 'laugh';
                    laughAudio.play();
                }else{
                    skeletonComponentOfElephant.animation = 'angry';
                    angryAudio.play();
                }
                skeletonComponentOfElephant.setCompleteListener((value) => {
                    if(value.animation.name == 'dance'){
                        skeletonComponentOfBird.loop = true;
                    }else{
                        skeletonComponentOfElephant.animation = 'idle';
                        skeletonComponentOfElephant.loop = true;
                    }
                });
            }
            if(dragNode.otherNode.name == 'smallCup'){
                skeletonComponentOfBird.loop = false;
                angryAudio.stop();
                laughAudio.stop();
                if(dragNode.isRightAnswer){
                    skeletonComponentOfBird.animation = 'laugh';
                    laughAudio.play();
                }else{
                    skeletonComponentOfBird.animation = 'angry';
                    angryAudio.play();    
                }
                skeletonComponentOfBird.setCompleteListener((value) => {

                    if(value.animation.name == 'dance'){
                        skeletonComponentOfBird.loop = true;
                    }else{
                        skeletonComponentOfBird.animation = 'idle';
                        skeletonComponentOfBird.loop = true;
                    }
                });

            }
            if(dragNode.isRightAnswer){
                this.state.rightMark = this.state.rightMark + 1

                if(this.state.step == 1){
                    const hinYaySpoonNode = dragNode.otherNode.children.filter(v=> v.name == 'hinYaySpoon')[0];
                    const hinYayNode = dragNode.otherNode.children.filter(v=> v.name == 'hinYay')[0];
                    const particle = dragNode.otherNode.children.filter(v=> v.name == 'particle')[0].getComponent(ParticleSystem2D);
                    const steam = dragNode.otherNode.children.filter(v=> v.name == 'steam')[0];
                    let xD ;let yD;let w;let h;
                    if(dragNode.node.name == 'food1'){
                        xD = 410;yD=300;w = 197;h = 58;// w = 'hinyay width // h= 'hinyay height
                    }
                    if(dragNode.node.name == 'food2'){
                        xD = 630;yD=300;w = 156;h = 55;
                    }
                    tween(dragNode.node)
                    .to(0.6, {worldPosition: new Vec3(xD,yD,0)})
                    .call(()=>{
                        dragNode.node.parent = hinYaySpoonNode;
                        dragNode.node.setWorldPosition(new Vec3(xD,yD,0))
                    })
                    .to(0.6, {angle: 18})
                    .call(()=>{
                        particle.resetSystem();
                        tween(hinYayNode)
                        .to(1.5, { width: w, height: h })
                        .call(()=>{
                            particle.stopSystem()
                            tween(dragNode.node)
                            .to(0.2,{scale: new Vec3(0,0,0)})
                            .call(()=>{
                                steam.getComponent(Sprite).enabled = true
                                const action1 = tween(steam).to(1, { width: 163, height: 175 })
                                const action2 = tween(steam).to(1, { width: 163, height: 130 })
                                tween(steam)
                                .sequence(action1,action2)
                                .repeatForever()
                                .start()
                            })
                            .start();
                        })
                        .start();
                    })
                    .start();
        
                }

                if(this.state.step == 2){
                    const motePhatNode = dragNode.otherNode.children.filter(v=> v.name == 'motePhat')[0];
                    let xD ;let yD;let w;let h;
                    if(dragNode.node.name == 'food1'){
                        xD = 410;yD=300;
                    }
                    if(dragNode.node.name == 'food2'){
                        xD = 630;yD=300;
                    }
                    tween(dragNode.node)
                    .to(0.6, {worldPosition: new Vec3(xD,yD,0)})
                    .call(()=>{
                        dragNode.node.parent = motePhatNode;
                        dragNode.node.setWorldPosition(new Vec3(xD,yD,0))
                    })
                    .to(0.6, {position: new Vec3(0,0,0)})
                    .start();
                }

                if(this.state.step == 3){
                    const eggNode = dragNode.otherNode.children.filter(v=> v.name == 'egg')[0];
                    if(dragNode.node.name == 'food1'){
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .call(()=>{
                            dragNode.node.parent = eggNode;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        // .parallel(
                        //     tween().to(0.6, {position: new Vec3(0,0,0)}),
                        //     tween().to(0.6, { scale: new Vec3(0.6,0.6,0.6) }),
                        // )
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = eggNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        .start();
                    }
        
                }

                if(this.state.step == 4){
                    const pelKyawNote = dragNode.otherNode.children.filter(v=> v.name == 'pelKyaw')[0];
                    console.log(dragNode.node.getWorldPosition())
                    if(dragNode.node.name == 'food1'){
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .call(()=>{
                            dragNode.node.parent = pelKyawNote;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = pelKyawNote;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        .start();
                    }
        
                }

                if(this.state.step == 5){
                    const nanPinNode = dragNode.otherNode.children.filter(v=> v.name == 'nanPin')[0];
                    console.log(dragNode.node.getWorldPosition())
                    if(dragNode.node.name == 'food1'){
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .call(()=>{
                            dragNode.node.parent = nanPinNode;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        // .to(0.6, {position: new Vec3(0,0,0)})
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.18,0.18,0.18) }),
                        )
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = nanPinNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        // .parallel(
                        //     tween().to(0.6, {position: new Vec3(0,0,0)}),
                        //     tween().to(0.6, { scale: new Vec3(0.4,0.4,0.4) }),
                        // )
                        .start();
                    }
        
                }

                if(this.state.step == 6){
                    const spoonNode = dragNode.otherNode.children.filter(v=> v.name == 'spoon')[0];
                    console.log(dragNode.node.getWorldPosition())
                    if(dragNode.node.name == 'food1'){
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .call(()=>{
                            dragNode.node.parent = spoonNode;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        // .parallel(
                        //     tween().to(0.6, {position: new Vec3(0,0,0)}),
                        //     tween().to(0.6, { scale: new Vec3(0.5,0.5,0.5) }),
                        // )
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = spoonNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        // .parallel(
                        //     tween().to(0.6, {position: new Vec3(0,0,0)}),
                        //     tween().to(0.6, { scale: new Vec3(0.4,0.4,0.4) }),
                        // )
                        .start();
                    }
        
                }

                if(this.state.step == 7){
                    console.log(`dragNode`)
                    console.log(dragNode)
                    console.log(dragNode.node.getWorldPosition())
                    if(dragNode.node.name == 'food1'){
                        const bucketNode = dragNode.otherNode.parent.children.filter(v=> v.name == 'bigBucket')[0];
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .call(()=>{
                            dragNode.node.parent = bucketNode;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.8,0.8,0.8) }),
                        )
                        .call(()=>{
                            console.log("finished1")
                            afterSevenStep()
                        })
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        const bucketNode = dragNode.otherNode.parent.children.filter(v=> v.name == 'smallBucket')[0];
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = bucketNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.7,0.7,0.7) }),
                        )
                        .call(()=>{
                            console.log("finished2")
                            afterSevenStep()
                        })
                        .start();
                    }
        
                }
                

               
                if(this.state.rightMark == 2){
                    if(this.state.step < 7){
                        this.state.rightMark = 0;
                        this.state.step += 1;
                        goToNextStep(self,this.state.step)
                    }
                }
                const afterSevenStep = () =>{
                    if(this.state.rightMark == 2){
                        const bigCupNode = self.bigCup;
                        const smallCupNode = self.smallCup;
                        const elephantMouth = bigCupNode.children.filter(v=> v.name == 'mouth')[0];
                        const birdMouth = smallCupNode.children.filter(v=> v.name == 'mouth')[0];
                        const shadowForBigCup = bigCupNode.children.filter(v=> v.name == 'shadow')[0];
                        const shadowForSmallCup = smallCupNode.children.filter(v=> v.name == 'shadow')[0];
                        shadowForBigCup.active = false;
                        shadowForSmallCup.active = false;
                        eatAudio.play();
     
                        tween(bigCupNode)
                        .parallel(
                            tween().to(2, {worldPosition: elephantMouth.getWorldPosition()}),
                            tween().to(2, { scale: new Vec3(0.2,0.2,0) }),
                        )
                        .call(()=>{
                            tween(bigCupNode.getComponent(UIOpacity))
                            .to(0.2,{opacity: 0})
                            .call(()=>{
                                skeletonComponentOfElephant.loop = true
                                skeletonComponentOfElephant.animation = 'dance';
                                eatAudio.stop();
                            })
                            .start()
                        })
                        .start();

                        tween(smallCupNode)
                        .parallel(
                            tween().to(2, {worldPosition: birdMouth.getWorldPosition()}),
                            tween().to(2, { scale: new Vec3(0.2,0.2,0) }),
                        )
                        .call(()=>{
                            tween(smallCupNode.getComponent(UIOpacity))
                            .to(0.2,{opacity: 0})
                            .call(()=>{
                                skeletonComponentOfBird.loop = true
                                skeletonComponentOfBird.animation = 'dance';
                                fireworkAudio.play();
                            })
                            .start()
                        })
                        .start();
                    }
                }
            }
        }

    }

    public getRandomNumber(array) {
        const numbersArray = [...array];
        const randomIndex = Math.floor(Math.random() * numbersArray.length);
        const randomNumber = numbersArray[randomIndex];
        
        return randomNumber;
    }

    getShowdowPostition(node,step,nodeX,nodeY){
        let shadowXPosition;
        let shadowYPosition ;
        if(step == 1){
            shadowXPosition = nodeX -((node.getContentSize().width/3) * node.scale.x);
            shadowYPosition = nodeY-((node.getContentSize().height/2) * node.scale.y);
        }else if(step == 2){
            shadowXPosition = nodeX -((node.getContentSize().width/14) * node.scale.x);
            shadowYPosition = nodeY -((node.getContentSize().height/2) * node.scale.y);
        }else if(step == 6){
            shadowXPosition = nodeX -((node.getContentSize().width/3) * node.scale.x);
            shadowYPosition = nodeY -((node.getContentSize().height/2) * node.scale.y);
        }else if(step == 7){
            shadowXPosition = nodeX -((node.getContentSize().width/14) * node.scale.x);
            shadowYPosition = nodeY -((node.getContentSize().height/3) * node.scale.y);
        }else{
            shadowXPosition = nodeX-((node.getContentSize().width/6) * node.scale.x);
            shadowYPosition = nodeY -((node.getContentSize().height/2) * node.scale.y);
        }
        return {x: shadowXPosition,y:shadowYPosition}
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


