import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export type ChainId = 'bera';

export const APP_CONFIG: {
    environmentId: string,
} = {
    environmentId: '98edb18e-e221-49ee-b426-e95b858c3bc7',
}

export const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(),
    },
}
);