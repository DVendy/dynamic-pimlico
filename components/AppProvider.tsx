'use client'

import { APP_CONFIG, wagmiConfig } from "@/data/constant";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SdkViewSectionType, SdkViewType } from "@dynamic-labs/sdk-api-core";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

interface Props {
    children: React.ReactNode;
}

const AppProvider = (props: Props) => {
    const queryClient = new QueryClient();

    return (
        <body className={`font-mono min-h-screen relative bg-slate-300`}>
            <DynamicContextProvider
                settings={{
                    environmentId: APP_CONFIG.environmentId,
                    walletConnectors: [EthereumWalletConnectors],
                    appLogoUrl: 'https://www.escher.finance/escher.svg',
                    appName: 'Escher.Finance',
                    overrides: {
                        views: [
                            {
                                type: SdkViewType.Login,
                                sections: [
                                    {
                                        type: SdkViewSectionType.Email,
                                    },
                                    {
                                        type: SdkViewSectionType.Separator,
                                        label: 'OR'
                                    },
                                    {
                                        type: SdkViewSectionType.Social,
                                        defaultItem: "google",
                                        numOfItemsToDisplay: 6
                                    },
                                    {
                                        type: SdkViewSectionType.Separator,
                                        label: 'OR'
                                    },
                                    {
                                        type: SdkViewSectionType.Wallet,
                                        numOfItemsToDisplay: 3
                                    },
                                ],
                            },
                        ]
                    }
                }}
            >
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <DynamicWagmiConnector>
                            {props.children}
                        </DynamicWagmiConnector>
                    </QueryClientProvider>
                </WagmiProvider>
            </DynamicContextProvider>
        </body>
    );
}

export default AppProvider;