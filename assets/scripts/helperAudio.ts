/**
 * Aye Maung Maung Kyi (StudioAMK © 2023)
 */
import { __private, _decorator, AudioClip, AudioSource, Component } from 'cc';

const { ccclass, property } = _decorator;

export enum AudioClipNames{
    "bg",
    "jump",
    "laugh",
    "meow",
    "hide",
    "show",
    "win"
}

@ccclass('AudioHelper')
export class AudioHelper extends Component {

    @property(AudioClip)
    public bgMusic: AudioClip;

    @property(AudioClip)
    public soundLaugh: AudioClip;

    @property(AudioClip)
    public soundMeow: AudioClip;

    @property(AudioClip)
    public soundJump: AudioClip;

    @property(AudioClip)
    public soundShow: AudioClip;

    @property(AudioClip)
    public soundHide: AudioClip;


    @property(AudioClip)
    public soundWin: AudioClip;

    private audio: AudioSource = new AudioSource("twinkle");

    play(clipName: AudioClipNames) {
        switch (clipName) {
            case AudioClipNames.bg:
                this.audio.clip = this.bgMusic;
                this.audio.loop = true;
                this.audio.play();
                break;

            case AudioClipNames.jump:
                this.audio.playOneShot(this.soundJump);
                break;

            case AudioClipNames.laugh:
                this.audio.playOneShot(this.soundLaugh);
                break;

            case AudioClipNames.meow:
                this.audio.playOneShot(this.soundMeow);
                break;

            case AudioClipNames.hide:
                this.audio.playOneShot(this.soundHide);
                break;

                case AudioClipNames.show:
                    this.audio.playOneShot(this.soundShow);
                    break;


                case AudioClipNames.win:
                    this.audio.playOneShot(this.soundWin);
                    break;
        }
    }

    stop(clipName: string) {
        this.audio.stop();
    }

}