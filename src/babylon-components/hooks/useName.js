import { useMemo } from "react"
import { v4 as uuidv4 } from 'uuid';

export const useName = () => {
    return useMemo(() => uuidv4(), [])
}
