import { Box, List, ListItem } from '@material-ui/core'
import { isFunction } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useKeydown } from '../hooks/useKeydown';
import { choiceSound, selectSound } from '../sounds/SFX';
import { SETTINGS, SET_SETTINGS } from '../utils/Settings';

const mod = function (num, n) {
    return ((num % n) + n) % n;
};

export const VerticleMenuSingle = ({selected, menuKey, slanted, index}) => {
    const styleAddin = selected ? {
        color: "white",
        WebkitTextStrokeColor: "black"
    } : {}

    return (<ListItem style={{
        left: slanted ? -index * 3 + "vh" : 0,
        transition: "left 2s",
        WebkitTextStrokeWidth: "1px",
        WebkitTextStrokeColor: "white",
        ...styleAddin
    }}
        key={menuKey}>
        {menuKey}
    </ListItem>)
}

export const VerticleMenuArray = ({selected, menuKey, menuValue, slanted, index}) => {
    const styleAddin = selected ? {
        color: "white",
        WebkitTextStrokeColor: "black"
    } : {}

    const [choice, setChoice] = useState(SETTINGS[menuKey.toUpperCase()]);

    useEffect(() => {
        SETTINGS[menuKey.toUpperCase()] = choice;
        SET_SETTINGS();
     }, [choice, menuKey]);

    const arrayIndex = menuValue.indexOf(choice);

    useKeydown("LEFT", () => {
        if(!selected) return;
        choiceSound.play();
        const newArrayIndex = mod(arrayIndex - 1, menuValue.length)
        setChoice(menuValue[newArrayIndex])
    })

    useKeydown("RIGHT", () => {
        if(!selected) return;
        choiceSound.play();
        const newArrayIndex = mod(arrayIndex + 1, menuValue.length)
        setChoice(menuValue[newArrayIndex])
    })

    return (<ListItem style={{
        left: slanted ? -index * 3 + "vh" : 0,
        transition: "left 2s",
        WebkitTextStrokeWidth: "1px",
        WebkitTextStrokeColor: "white",
    }}
        key={menuKey}>
        <Box display="flex" position="relative" left="-250px">
            <span style={{...styleAddin}}>{menuKey}</span>
            <Box position="absolute" left="300px">
                {menuValue.map(val => {
                    const selected = val === choice;
                    
                    const styleAddin = selected ? {
                        color: "white",
                        WebkitTextStrokeColor: "black"
                    } : {}

                    return <span key={val} style={{padding: "10px", ...styleAddin}}>{val}</span>
                })}
            </Box>
        </Box>
    </ListItem>)
}


export const VerticleMenu = ({ menuMap, active = true, slanted = false }) => {

    const menuKeys = Object.keys(menuMap)
    const numChildren = menuKeys.length;
    const [selectedItem, setSelectedItem] = useState(0);

    useKeydown("UP", () => {
        if (!active) return;
        setSelectedItem(mod((selectedItem - 1), numChildren))
        choiceSound.play();
    })
    useKeydown("DOWN", () => {
        if (!active) return;
        setSelectedItem(mod((selectedItem + 1), numChildren))
        choiceSound.play();
    })
    useKeydown("ENTER", () => {
        if (!active) return;

        const menuValue = menuMap[menuKeys[selectedItem]];
        if (!isFunction(menuValue)) return;

        menuMap[menuKeys[selectedItem]]();
        selectSound.play();
    })

    return (
        <List style={{ visibility: active ? "visible" : "hidden"}}>
            {menuKeys.map((menuKey, i) => {
                const menuValue = menuMap[menuKey];
                const menuItemProps = {
                    selected: i === selectedItem,
                    menuKey: menuKey,
                    slanted: slanted,
                    index: i,
                    menuValue: menuValue,
                }

                if(isFunction(menuValue))
                    return <VerticleMenuSingle key={i} {...menuItemProps}/>
                if(Array.isArray(menuValue))
                    return <VerticleMenuArray  key={i} {...menuItemProps}/>
                return false;
            })}
        </List>
    )
}
