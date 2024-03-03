import { createContext } from 'react'
import { useSessionStorage } from './hooks/useSessionStorage'

export const AuthContext = createContext<ReturnType<typeof useSessionStorage>>(
    undefined!,
);
