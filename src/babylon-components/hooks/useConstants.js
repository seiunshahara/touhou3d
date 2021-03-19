import { useContext } from "react";
import { ConstantsContext } from "../GeneralContainer";

export const useConstants = () => {
    return useContext(ConstantsContext)
}
