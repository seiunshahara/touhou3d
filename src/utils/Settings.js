import ls from "local-storage"
import * as SOUNDS from "../sounds/SoundSystem";

export const SETTINGS = ls('SETTINGS') ? JSON.parse(ls('SETTINGS')) : {
    PLAYER: 3,
    BOMB: 2,


    MUSIC: "ON",
    SFX: "ON"
}

export const SET_SETTINGS = () => {
    if(SETTINGS.MUSIC === "OFF"){
        for(let sound in SOUNDS){
            if(SOUNDS[sound].stop && SOUNDS[sound].music) SOUNDS[sound].stop()
        }
    }

    if(SETTINGS.SFX === "OFF"){
        for(let sound in SOUNDS){
            if(SOUNDS[sound].stop && SOUNDS[sound].sfx) SOUNDS[sound].stop()
        }
    }

    ls('SETTINGS', JSON.stringify(SETTINGS))
}