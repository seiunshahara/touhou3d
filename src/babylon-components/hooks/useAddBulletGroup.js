import { useContext } from 'react'
import { BulletsContext } from '../GeneralContainer'

export const useAddBulletGroup = () => {
    return useContext(BulletsContext).addBulletGroup;
}
