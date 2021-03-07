import { List, ListItem } from '@material-ui/core'
import React, { useState } from 'react'
import { useKeydown } from '../hooks/useKeydown';
import MultiSound from '../sounds/MultiSound';

const mod = function(num, n) {
    return ((num%n)+n)%n;
};

const choiceSound = new MultiSound("sfx/select00.wav", 20, .20)
const selectSound = new MultiSound("sfx/ok00.wav", 20, .20)

export const VerticleMenu = ({menuMap, slanted}) => {

    const menuKeys = Object.keys(menuMap)
    const numChildren = menuKeys.length;
    const [selectedItem, setSelectedItem] = useState(0);
    useKeydown("UP", () => {
        setSelectedItem(mod((selectedItem - 1), numChildren))
        choiceSound.play();
    })
    useKeydown("DOWN", () => {
        setSelectedItem(mod((selectedItem + 1), numChildren))
        choiceSound.play();
    })
    useKeydown("ENTER", () => {
        menuMap[menuKeys[selectedItem]]();
        selectSound.play();
    })

    return (
        <List>
            {menuKeys.map((menuKey, i) => {

                const styleAddin = i === selectedItem ? {
                    color: "white",
                    WebkitTextStrokeColor: "black"
                } : {}

                return (<ListItem key={i} style={{ 
                    left: slanted ? -i * 3 + "vh" : 0,
                    transition: "left 2s",
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextStrokeColor: "white",
                    ...styleAddin
                }}>
                    {menuKey}
                </ListItem>)

            })}
        </List>
    )
}
