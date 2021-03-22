import React from 'react'
import { useName } from '../hooks/useName';
import { useAssets } from '../hooks/useAssets';

const BlueFairy = React.forwardRef(({...props}, ref) => {
    const name = useName();
    const blueFairy = useAssets("blueFairyTexture");

    return (
        <plane ref={ref} name={name} width={0.5} height={0.5} {...props}>
            <standardMaterial diffuseTexture={blueFairy} name={name + "mat"} />
        </plane>
    )
})

BlueFairy.radius = 0.5;
export {BlueFairy};
