export const calcPowerClass = (power) => {
    if(power < 10) return 0;
    if(power >= 10 && power < 60) return 1;
    if(power >= 60 && power < 120) return 2;
    if(power >= 120) return 3;
}