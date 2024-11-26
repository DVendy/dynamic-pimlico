'use client';

import useStakingContract from "@/hooks/useStakingContract";
import { SmartAccountClient } from "permissionless";
import { useState } from "react";
import { PublicClient, WalletClient } from "viem";

interface Props {
    publicClient: PublicClient
    walletClient: WalletClient | SmartAccountClient
}

const AppStaking = (props: Props) => {

    const sepoliaTestContract = useStakingContract({
        publicClient: props.publicClient,
        walletClient: props.walletClient
    });

    const [number, setNumber] = useState<string>('0');
    const [result, setResult] = useState<string>();
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <div className="flex flex-col items-start gap-4 bg-slate-800 text-slate-100 px-6 py-4 rounded">
            <div className="text-lg font-bold">Staking App</div>
            <button
                onClick={async () => {
                    setIsProcessing(true);
                    setResult(undefined);
                    const _result = await sepoliaTestContract.totalStaked();
                    setResult(JSON.stringify(_result));
                    setIsProcessing(false);
                }}
                className="rounded px-4 py-1 border-2 border-blue-500 text-blue-100 bg-blue-900 hover:bg-blue-800 transition-all font-bold text-sm"
            >
                {isProcessing ? <>processing...</> : <>Get total staked</>}
            </button>
            <hr className="w-1/2 border border-slate-400" />

            <input type="number" value={number} onChange={(val) => setNumber(val.target.value)} className="text-black" />
            <button
                onClick={async () => {
                    setIsProcessing(true);
                    setResult(undefined);
                    const _result = await sepoliaTestContract.stake(number);
                    setResult(JSON.stringify(_result));
                    setIsProcessing(false);
                }}
                className="rounded px-4 py-1 border-2 border-blue-500 text-blue-100 bg-blue-900 hover:bg-blue-800 transition-all font-bold text-sm"
            >
                {isProcessing ? <>processing...</> : <>Stake</>}
            </button>
            <hr className="w-1/2 border border-slate-400" />

            <div>result:</div>
            {result !== undefined &&
                <div className="border rounded p-4 w-full">{result}</div>
            }
        </div>
    );
}

export default AppStaking;