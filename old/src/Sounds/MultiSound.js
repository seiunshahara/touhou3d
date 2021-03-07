export default class MultiSound{
    constructor(url, num, volume = 1){
        this.sounds = [];
        for(let i = 0; i < num; i++){
            const audio = new Audio(url);
            audio.volume = volume
            this.sounds.push(audio);
        }

        this.curSound = 0;
    }

    play(){
        if(window.config.doSound){
            this.sounds[this.curSound].play();
            this.curSound ++;
            this.curSound = this.curSound % this.sounds.length;
        }
    }
}