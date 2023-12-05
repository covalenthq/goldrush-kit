import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useCovalent } from "./Covalent";
import { type ChainItem } from "@covalenthq/client-sdk";

interface ChainsType {
    chains: ChainItem[] | null;
}

interface ChainsProviderProps {
    children: ReactNode;
}

const ChainsContext = createContext<ChainsType>({} as ChainsType);

export const ChainsProvider: React.FC<ChainsProviderProps> = ({ children }) => {
    const { covalentClient } = useCovalent();

    const [chains, setChains] = useState<ChainItem[] | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const allChainsResp =
                    await covalentClient.BaseService.getAllChains();
                setChains(allChainsResp.data.items);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <ChainsContext.Provider value={{ chains: chains }}>
            {children}
        </ChainsContext.Provider>
    );
};

export const useChains = () => useContext(ChainsContext);
