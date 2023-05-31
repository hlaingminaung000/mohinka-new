import { _decorator, Component, Node, Skeleton, Vec3,sp, tween, ParticleSystem2D, Color, v2, AudioSource,game, Sprite } from 'cc';
import { AudioClipNames, AudioHelper } from './helperAudio';
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
        step : 1,
        rightMark: 0
    }
    
    onLoad() {
        const self = this;
        this.goToNextStep(self,self.state.step)
        // self.node.getComponent(AudioHelper).play(AudioClipNames.bg);
 
        tween(self.logoPlacement)
        .to(1, {position: new Vec3(403,273,0)})
        .start();
        
    }

    public goToNextStep(self,step) {

        console.log("self",self)
        const index = step - 1;
        const randomNum1 = self.getRandomNumber(self.state.foodNum);
        const filteredArray = self.state.foodNum.filter((num)=> randomNum1 != num );
        const randomNum2 = self.getRandomNumber(filteredArray);

        const leftFoodNode = self.steps[index].children[randomNum1-1];
        const rightFoodNode = self.steps[index].children[randomNum2-1]
        leftFoodNode.setPosition(new Vec3(-180,-40))
        rightFoodNode.setPosition(new Vec3(100,-30))

        const originalScaleForLeftFood = leftFoodNode.scale.clone()
        const originalScaleForRightFood = rightFoodNode.scale.clone()

        leftFoodNode.scale = new Vec3(0,0,0)
        rightFoodNode.scale = new Vec3(0,0,0)


        self.steps[index].active = true;
        self.steps[index].active = true;
        leftFoodNode.active = true ;
        rightFoodNode.active = true ;

        tween( leftFoodNode)
        .to(1, {scale: originalScaleForLeftFood})
        .start();

        tween( rightFoodNode)
        .to(1, {scale: originalScaleForRightFood})
        .start();
     
        
    }
    public animation(dragNode){
        const self = this;
        const goToNextStep = self.goToNextStep;
        const laughAudio  = self.node.getComponent(AudioHelper).soundLaugh;
        const angryAudio = self.node.getComponent(AudioHelper).soundMeow;
        const fireworkAudio = self.node.getComponent(AudioHelper).soundWin;

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
                    console.log("dragNode.nodeName",dragNode.node.name);
                    console.log(dragNode.node.getWorldPosition())
                    if(dragNode.node.name == 'food1'){
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .to(0.6, {angle: 18})
                        .call(()=>{
                            dragNode.node.parent = hinYaySpoonNode;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        .to(0.6, {worldPosition: new Vec3(343+20,295+80,0)})
                        .call(()=>{
                            hinYayNode.getComponent(Sprite).enabled = true
                            tween(hinYayNode)
                            .to(0.5, {position: new Vec3(0,20,0)})
                            .call(()=>{
                                dragNode.node.getComponent(Sprite).enabled = false
                            })
                            .start();
                        })
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .to(0.6, {angle: 18})
                        .call(()=>{
                            dragNode.node.parent = hinYaySpoonNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .to(0.6, {worldPosition: new Vec3(638,350,0)})
                        .call(()=>{
                            hinYayNode.getComponent(Sprite).enabled = true
                            tween(hinYayNode)
                            .to(0.5, {position: new Vec3(0,20,0)})
                            .call(()=>{
                                dragNode.node.getComponent(Sprite).enabled = false
                            })
                            .start();
                        })
                        .start();
                    }
        
                }

                if(this.state.step == 2){
                    const motePhatNode = dragNode.otherNode.children.filter(v=> v.name == 'motePhat')[0];
                    console.log(dragNode.node.getWorldPosition())
                    if(dragNode.node.name == 'food1'){
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(363,420,0)})
                        .call(()=>{
                            dragNode.node.parent = motePhatNode;
                            dragNode.node.setWorldPosition(new Vec3(363,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = motePhatNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .to(0.6, {position: new Vec3(0,0,0)})
                        .start();
                    }
        
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
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.6,0.6,0.6) }),
                        )
                        .start();
                    }
                    if(dragNode.node.name == 'food2'){
                        
                        tween(dragNode.node)
                        .to(0.6, {worldPosition: new Vec3(638,420,0)})
                        .call(()=>{
                            dragNode.node.parent = eggNode;
                            dragNode.node.setWorldPosition(new Vec3(638,420,0))
                        })
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.4,0.4,0.4) }),
                        )
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
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.5,0.5,0.5) }),
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
                        .parallel(
                            tween().to(0.6, {position: new Vec3(0,0,0)}),
                            tween().to(0.6, { scale: new Vec3(0.4,0.4,0.4) }),
                        )
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
     
                        tween(bigCupNode)
                        .parallel(
                            tween().to(1, {worldPosition: elephantMouth.getWorldPosition()}),
                            tween().to(1, { scale: new Vec3(0,0,0) }),
                        )
                        .call(()=>{
                            skeletonComponentOfElephant.loop = true
                            skeletonComponentOfElephant.animation = 'dance';
                        })
                        .start();

                        tween(smallCupNode)
                        .parallel(
                            tween().to(1, {worldPosition: birdMouth.getWorldPosition()}),
                            tween().to(1, { scale: new Vec3(0,0,0) }),
                        )
                        .call(()=>{
                            skeletonComponentOfBird.loop = true
                            skeletonComponentOfBird.animation = 'dance';
                            fireworkAudio.play();  
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

    start() {
        // this.food1.active = true;
        // this.food2.active = true;
        // this.food1.setPosition((new Vec3(27.44,-175.466,0)))
        // this.food2.setPosition((new Vec3(-413.745,-175.546,0)))

    }

    update(deltaTime: number) {
        
    }
}


