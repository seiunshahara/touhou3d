import { useContext } from "react";
import { ConstantsContext } from "../../components/ConstantsContainer";

export const useConstants = () => {
    return useContext(ConstantsContext)
}
