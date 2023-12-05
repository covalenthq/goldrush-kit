import { createContext, useContext, useMemo } from "react";
import { CovalentClient } from "@covalenthq/client-sdk";
import { Toaster } from "@/components/ui/toaster";

interface CovalentContextType {
    covalentClient: CovalentClient;
}

interface CovalentProviderProps {
    children: React.ReactNode;
    apikey: string;
}

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
