export const calcPowerClass = (power) => {
    return 0;
    if(power < 10) return 0;
    if(power >= 10 && power < 25) return 1;
    if(power >= 25 && power < 70) return 2;
    if(power >= 25 && power < 70) return 3;
    if(power >= 120) return 4;
}