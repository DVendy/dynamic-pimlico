'use client';

import useStakingContract from "@/hooks/useStakingContract";
import { SmartAccountClient } from "permissionless";
import { useState } from "react";
import { parseEther, PublicClient, WalletClient } from "viem";

interface Props {
    publicClient: PublicClient
    walletClient: WalletClient | SmartAccountClient
}

const AppTransfer = (props: Props) => {

    const [address, setAddress] = useState<string>();
    const [number, setNumber] = useState<string>('0');
    const [result, setResult] = useState<string>();
    const [isProcessing, setIsProcessing] = useState(false);

    const submit = async () => {
        setIsProcessing(true);
        setResult(undefined);
        try {
            if (!address) {
                throw 'Invalid address';
            }
            const txHash = await (props.walletClient as any)?.sendTransaction({
                to: address,
                value: parseEther(number),
            });
            console.log(`User operation included: https://sepolia.etherscan.io/tx/${txHash}`);
            setResult(`User operation included: https://sepolia.etherscan.io/tx/${txHash}`);
        } catch (error: any) {
            setResult(error.toString());
        }
        setIsProcessing(false);
    }

    return (
        <div className="flex flex-col items-start gap-4 bg-slate-800 text-slate-100 px-6 py-4 rounded">
            <div className="text-lg font-bold">Transfer App</div>
            <input type="text" value={address} onChange={(val) => setAddress(val.target.value)} className="text-black" placeholder="Recipient address" />
            <input type="number" value={number} onChange={(val) => setNumber(val.target.value)} className="text-black" />
            <button
                onClick={submit}
                className="rounded px-4 py-1 border-2 border-blue-500 text-blue-100 bg-blue-900 hover:bg-blue-800 transition-all font-bold text-sm"
            >
                {isProcessing ? <>processing...</> : <>Transfer</>}
            </button>
            <hr className="w-1/2 border border-slate-400" />

            <div>result:</div>
            {result !== undefined &&
                <div className="border rounded p-4 w-full overflow-scroll">{result}</div>
            }
        </div>
    );
}

export default AppTransfer;