import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type ChainItem, CovalentClient } from "@covalenthq/client-sdk";
import { Toaster } from "@/components/ui/toaster";

interface CovalentContextType {
    covalentClient: CovalentClient;
    chains: ChainItem[] | null;
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
    const [chains, setChains] = useState<ChainItem[] | null>(null);

    const covalentClient = useMemo<CovalentClient>(
        () => new CovalentClient(apikey),
        [apikey]
    );

    useEffect(() => {
        if (covalentClient && !chains) {
            (async () => {
                try {
                    const allChainsResp =
                        await covalentClient.BaseService.getAllChains();
                    setChains(allChainsResp.data.items);
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [covalentClient]);

    return (
        <CovalentContext.Provider
            value={{ covalentClient: covalentClient, chains: chains }}
        >
            {children}
            <Toaster />
        </CovalentContext.Provider>
    );
};

export const useCovalent = () => useContext(CovalentContext);
