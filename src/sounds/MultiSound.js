import { SETTINGS } from "../utils/Settings";

export default class MultiSound {
    constructor(url, volume = 0.1) {
        this.url = url;
        this.volume = volume;

        this.initFunc = (...args) => this.init(args);

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

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.gainNode = this.audioContext.createGain()
        this.gainNode.gain.value = this.volume
        this.gainNode.connect(this.audioContext.destination)

        this.source = this.audioContext.createBufferSource();

        fetch(this.url)
        .then(resp => resp.arrayBuffer())
        .then(buf => this.audioContext.decodeAudioData(buf)) // can be callback as well
        .then(decoded => {
            this.source.buffer = this.buf = decoded;
            this.source.loop = false;
            this.source.connect(this.gainNode);

            this.ready = true;
        })
        .catch(err => console.error(err));
    }

    play() {
        if(!this.ready) return;
        if(SETTINGS.SFX === "OFF") return;

        this.stop();

        this.source.start(0);
        this.playing = true;
    }

    stop() {
        if(!this.ready || !this.playing) return;

        this.source.stop(0); // this destroys the buffer source
        const newSource = this.audioContext.createBufferSource(); // so we need to create a new one
        newSource.buffer = this.buf;
        newSource.loop = false;
        newSource.connect(this.gainNode);
        this.source = newSource;
        this.playing = false;
    }
}