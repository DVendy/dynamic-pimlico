import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export type ChainId = 'bera';

export const APP_CONFIG: {
    environmentId: string,
} = {
    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV!,
}

export const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
}
);