import { useEffect, useRef } from "react";

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const filterInPlace = (a, condition) => {
    let i = 0, j = 0;

    while (i < a.length) {
        const val = a[i];
        if (condition(val, i, a)) a[j++] = val;
        i++;
    }

    a.length = j;
    return a;
}

const usePrevious = (value, initialValue) => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency
                }
            };
        }

        return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effectHook, dependencies);
};

export const capFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const mod = (n, m) => {
    return ((n % m) + m) % m;
}

export const staticReplace = (obj, prop, index, value) => {
    const newArray = [...obj[prop]];
    newArray[index] = value;
    obj[prop] = newArray;
}