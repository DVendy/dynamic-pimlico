'use client';

import useStorageContract from "@/hooks/useStorageContract";
import { SmartAccountClient } from "permissionless";
import { useState } from "react";
import { PublicClient, WalletClient } from "viem";

interface Props {
    publicClient: PublicClient
    walletClient: WalletClient | SmartAccountClient
}

const AppStorage = (props: Props) => {

    const sepoliaTestContract = useStorageContract({
        publicClient: props.publicClient,
        walletClient: props.walletClient
    });


    const [number, setNumber] = useState<number>(0);
    const [result, setResult] = useState<string>();
    const [isRetrieving, setIsRetrieving] = useState(false);
    const [isStoring, setIsStoring] = useState(false);

    return (
        <div className="flex flex-col items-start gap-4 bg-slate-800 text-slate-100 px-6 py-4 rounded">
            <div className="text-lg font-bold">Storage App</div>
            <button
                onClick={async () => {
                    setIsRetrieving(true);
                    setResult(undefined);
                    const _result = await sepoliaTestContract.retrieve();
                    setResult(JSON.stringify(_result));
                    setIsRetrieving(false);
                }}
                className="rounded px-4 py-1 border-2 border-blue-500 text-blue-100 bg-blue-900 hover:bg-blue-800 transition-all font-bold text-sm"
            >
                {isRetrieving ? <>processing...</> : <>Retrieve</>}
            </button>
            <hr className="w-1/2 border border-slate-400" />

            <input type="text" value={number} onChange={(val) => setNumber(Number(val.target.value))} className="text-black" />
            <button
                onClick={async () => {
                    setIsStoring(true);
                    setResult(undefined);
                    const _result = await sepoliaTestContract.store(number);
                    setResult(JSON.stringify(_result));
                    setIsStoring(false);
                }}
                className="rounded px-4 py-1 border-2 border-blue-500 text-blue-100 bg-blue-900 hover:bg-blue-800 transition-all font-bold text-sm"
            >
                {isStoring ? <>processing...</> : <>Store</>}
            </button>
            <hr className="w-1/2 border border-slate-400" />

            <div>result:</div>
            {result !== undefined &&
                <div className="border rounded p-4 w-full">{result}</div>
            }
        </div>
    );
}

export default AppStorage;