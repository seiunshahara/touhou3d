import { useContext } from "react";
import { ConstantsContext } from "../BulletsPositionsAndConstantsContainer";

export const useConstants = () => {
    return useContext(ConstantsContext)
}
