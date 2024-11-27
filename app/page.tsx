'use client';

import AppStaking from "@/components/AppStaking";
import AppStorage from "@/components/AppStorage";
import AppTransfer from "@/components/AppTransfer";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { createSmartAccountClient, SmartAccountClient } from "permissionless";
import { toSafeSmartAccount, toSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { useEffect, useMemo, useState } from "react";
import { formatEther, parseEther, WalletClient } from "viem";
import { entryPoint07Address, SmartAccount } from "viem/account-abstraction";
import { http, useAccount, useBalance, usePublicClient, useWalletClient } from "wagmi";

export default function Home() {
  const pimlicoUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=pim_RTec7d4Wh1USs9JJs3NaG9`

  const account = useAccount();
  const publicClient = usePublicClient();
  const { data: standardWalletClient } = useWalletClient();

  const paymasterClient = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  })

  const [useSmartAccount, setUseSmartAccount] = useState(false);
  const [smartAccountClient, setSmartAccountClient] = useState<SmartAccountClient>();
  const [isProcessing, setIsProcessing] = useState(false);

  const walletClient = useMemo((): WalletClient | SmartAccountClient | undefined => {
    return useSmartAccount ? smartAccountClient : standardWalletClient;
  }, [useSmartAccount, smartAccountClient, standardWalletClient]);

  const balance = useBalance({
    address: walletClient?.account?.address,
  });

  const getSmartAccount = async () => {
    if (!publicClient || !standardWalletClient) {
      return undefined;
    }
    setIsProcessing(true);

    const _safeAccount = await toSafeSmartAccount({
      client: publicClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
      owners: [standardWalletClient],
      version: "1.4.1",
    });
    console.log(`Safe account address: https://sepolia.etherscan.io/address/${_safeAccount.address}`);

    const _smartAccountClient = createSmartAccountClient({
      account: _safeAccount,
      chain: publicClient.chain,
      paymaster: paymasterClient,
      bundlerTransport: http(pimlicoUrl),
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await paymasterClient.getUserOperationGasPrice()).fast
        },
      },
    });
    if (_smartAccountClient !== undefined) {
      setSmartAccountClient(_smartAccountClient);
    }

    setIsProcessing(false);
  }

  useEffect(() => {
    if (standardWalletClient !== undefined) {
      getSmartAccount();
    }
    if (account.isDisconnected) {
      setSmartAccountClient(undefined);
    }
  }, [standardWalletClient, account.status]);

  return (
    <div className="container mx-auto p-8 flex flex-col items-start gap-4">
      <div className="w-full">
        <DynamicWidget />
      </div>
      {account.isConnected &&
        <>
          <div className="border border-slate-500 rounded p-4 flex flex-col gap-2 items-start">
            <button onClick={getSmartAccount} className="button">{isProcessing ? 'processing...' : 'get smart account'}</button>
            {smartAccountClient === undefined ?
              <div>Smart account client not created</div>
              :
              <div>Smart account address : {smartAccountClient?.account?.address}</div>
            }
          </div>

          <div className="flex flex-col gap-1">
            <div className="bg-green-600 text-green-50 px-2 py-1 text-sm font-semibold">
              <div>Active account : {walletClient?.account?.address}</div>
              <div>Balance : {formatEther(balance?.data?.value ?? BigInt(0))}</div>
            </div>
            <div className="flex gap-2 items-center text-sm font-bold">
              <div>Use smart account</div>
              <input type="checkbox" checked={useSmartAccount} onChange={() => setUseSmartAccount(prev => !prev)} />
            </div>
          </div>

          {(publicClient && walletClient) &&
            <div className="w-full grid grid-cols-2 gap-8">
              <AppTransfer
                publicClient={publicClient}
                walletClient={walletClient}
              />
              <AppStorage
                publicClient={publicClient}
                walletClient={walletClient}
              />
              <AppStaking
                publicClient={publicClient}
                walletClient={walletClient}
              />
            </div>
          }
        </>
      }
    </div>
  );
}
