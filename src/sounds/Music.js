import { SETTINGS } from "../utils/Settings";
import BGM from "./BGM";

class MusicClass{
    constructor(){
        this.BGMs = {};
        this.BGMs.menuTheme = new BGM("/music/Eternal Night Vignette ~ Eastern Night.mp3", .30);
        this.BGMs.stage1Theme = new BGM("/music/Illusionary Night ~ Ghostly Eyes.mp3", .30);
        this.BGMs.wriggleTheme = new BGM("/music/Stirring an Autumn Moon ~ Mooned Insect.mp3", .30);
        this.isPlaying = false;

        this.initFunc = () => this.init();

        document.body.addEventListener('keydown', this.initFunc);
        document.body.addEventListener('click', this.initFunc);
        document.body.addEventListener('touchstart',this.initFunc);
    }

    init() {
        if(this.didInit) return;

        document.body.removeEventListener('keydown', this.initFunc);
        document.body.removeEventListener('click', this.initFunc);
        document.body.removeEventListener('touchstart',this.initFunc);
        this.didInit = true;
        const _this = this;

        for(let BGMIndex in this.BGMs){
            this.BGMs[BGMIndex].init(this.activeSound === BGMIndex && SETTINGS.MUSIC === "ON", () => {
                _this.startedAt = Date.now();
            });
        }
    }

    play(activeSound){
        
        if(activeSound) this.activeSound = activeSound;
        if(SETTINGS.MUSIC === "OFF" || !this.activeSound) return;
        if (this.pausedAt) {
            this.startedAt = Date.now() - this.pausedAt;
            this.BGMs[this.activeSound].play(0, this.pausedAt / 1000);
        }
        else {
            this.startedAt = Date.now();
            this.BGMs[this.activeSound].play(0);
        }

    }

    pause(){
        if(this.activeSound){
            this.pausedAt = Date.now() - this.startedAt;
        }
        this.stop();
    }

    stop(){
        if(this.activeSound){
            this.BGMs[this.activeSound].stop();
        }
    }
}

export default new MusicClass();