import { createContext, useContext, useMemo } from "react";
import { CovalentClient } from "@covalenthq/client-sdk";
import { Toaster } from "@/components/ui/toaster";
import {
    type CovalentContextType,
    type CovalentProviderProps,
} from "../types/shared.types";

const CovalentContext = createContext<CovalentContextType>(
    {} as CovalentContextType
);

export const CovalentProvider: React.FC<CovalentProviderProps> = ({
    children,
    apikey,
}) => {
    const covalentClient = useMemo<CovalentClient>(
        () => new CovalentClient(apikey),
        [apikey]
    );

    return (
        <CovalentContext.Provider value={{ covalentClient: covalentClient }}>
            {children}
            <Toaster />
        </CovalentContext.Provider>
    );
};

export const useCovalent = () => useContext(CovalentContext);
