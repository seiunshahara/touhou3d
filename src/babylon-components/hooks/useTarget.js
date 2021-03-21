import { useContext } from "react"
import { TargetContext } from "../GeneralContainer"

export const useTarget = () => {
    return useContext(TargetContext)
}
