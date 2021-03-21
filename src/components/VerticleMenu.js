import { List, ListItem } from '@material-ui/core'
import { isFunction } from 'lodash';
import React, { useState } from 'react'
import { useKeydown } from '../hooks/useKeydown';
import { choiceSound, selectSound } from '../sounds/SoundSystem';

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
    return (<ListItem style={{
        left: slanted ? -index * 3 + "vh" : 0,
        transition: "left 2s",
        WebkitTextStrokeWidth: "1px",
        WebkitTextStrokeColor: "white",
    }}
        key={menuKey}>
        {menuKey + " " + menuValue.join(" ")}
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
        <List style={{ visibility: active ? "visible" : "hidden" }}>
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
