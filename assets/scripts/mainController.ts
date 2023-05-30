import { _decorator, Component, Node, Skeleton, Vec3,sp, tween, ParticleSystem2D, Color, v2, AudioSource,game, Sprite } from 'cc';
import { AudioHelper } from './helperAudio';
const { ccclass, property } = _decorator;


@ccclass('mainController')
export class mainController extends Component {
    @property({ type: Node})
    public steps : Node[] = [];

    
    @property({ type: Node})
    public elephant : Node = null;

    @property({ type: Node})
    public bird : Node = null;


    state = {
        foodNum : [1,2],
        step : 1,
        rightMark: 0
    }
    
    onLoad() {
        const self = this;
        this.goToNextStep(self,self.state.step)
        // this.node.getComponent(mainController).bgm.getComponent(AudioSource).loop = true;
        // console.log("audio",this.node.getComponent(mainController).bgm.getComponent(AudioSource))
    }

    public goToNextStep(self,step) {

        console.log("self",self)
        const index = step - 1;
        const randomNum1 = self.getRandomNumber(self.state.foodNum);
        const filteredArray = self.state.foodNum.filter((num)=> randomNum1 != num );
        
        const randomNum2 = self.getRandomNumber(filteredArray);
        self.steps[index].children[randomNum1-1].setPosition(new Vec3(-180,-40))
        self.steps[index].children[randomNum2-1].setPosition(new Vec3(100,-30))

        self.steps[index].active = true;
        self.steps[index].active = true;
        self.steps[index].children[randomNum1-1].active = true ;
        self.steps[index].children[randomNum2-1].active = true ;
    }
    public animation(dragNode){
        console.log("dragNode",dragNode)
        console.log("dragNodeName",dragNode.name)
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
                if(dragNode.isRightAnswer){
                    skeletonComponentOfElephant.animation = 'laugh';
                    laughAudio.play();
                }else{
                    skeletonComponentOfElephant.animation = 'angry';
                    angryAudio.play();
                }
            }
            if(dragNode.otherNode.name == 'smallCup'){
                skeletonComponentOfBird.loop = false;
                if(dragNode.isRightAnswer){
                    skeletonComponentOfBird.animation = 'laugh';
                    laughAudio.play();
                }else{
                    skeletonComponentOfBird.animation = 'angry';
                    angryAudio.play();    
                }

            }
            if(dragNode.isRightAnswer){
                const hinYaySpoonNode = dragNode.otherNode.children.filter(v=> v.name == 'hinYaySpoon')[0]
                // dragNode.node.parent = hinYaySpoonNode;
                const hinYayNode = dragNode.otherNode.children.filter(v=> v.name == 'hinYay')[0]
    
                console.log("othernode wordl Position",dragNode.otherNode.worldPosition)
                tween(dragNode.node)
                .to(1, {worldPosition: new Vec3(363,415,0)})
                // .delay(0.5)
                .to(1, {angle: 18})
                // .delay(0.5)
                .call(()=>{
                    dragNode.node.parent = hinYaySpoonNode;
                    dragNode.node.setPosition(new Vec3(0,0,0))
                })
                .to(0.2, {worldPosition: new Vec3(343+20,295+80,0)})
                .delay(0.5)
                .call(()=>{
                    hinYayNode.getComponent(Sprite).enabled = true
                })
                .start();
                tween(hinYayNode)
                .to(0.8, {position: new Vec3(0,20,0)})
                .start();
                console.log('dragNode',dragNode.node)
                console.log('hinYaySpoonNode',hinYaySpoonNode)

                


                hinYayNode.setPosition(new Vec3(0,100,0))
     
                this.state.rightMark = this.state.rightMark + 1
                if(this.state.rightMark == 2){
                    this.state.rightMark = 0;
                    if(this.state.step < 7){
                        this.state.step += 1;
                        goToNextStep(self,this.state.step)
                    }else{
                        skeletonComponentOfElephant.loop = true
                        skeletonComponentOfElephant.animation = 'dance';

                        skeletonComponentOfBird.loop = true
                        skeletonComponentOfBird.animation = 'dance';
                        fireworkAudio.play();  
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


