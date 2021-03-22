import { useContext } from "react"
import { PositionsContext } from "../GeneralContainer"

export const usePositions = () => {
    return useContext(PositionsContext)
}
