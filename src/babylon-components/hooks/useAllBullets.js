import { useContext } from "react"
import { BulletsContext } from "../GeneralContainer"

export const useAllBullets = () => {
    return useContext(BulletsContext).allBullets
}
