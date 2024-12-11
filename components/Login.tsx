import { FilterChain, FilterWallets, useSocialAccounts, useWalletOptions } from "@dynamic-labs/sdk-react-core";
import { ProviderEnum } from "@dynamic-labs/types";
import { WalletIcon } from '@dynamic-labs/wallet-book';
import { useMemo } from "react";

const Login = () => {
    const { error, isProcessing, signInWithSocialAccount } = useSocialAccounts();
    const { selectWalletOption, walletOptions, getFilteredWalletOptions } = useWalletOptions();

    const wallets = useMemo<typeof walletOptions>(() => {
        let wallet_list: typeof walletOptions = [];

        const lastUsed = walletOptions.find(w => w.key == (localStorage.getItem('dynamic_last_used_wallet')?.replaceAll(`"`, '')));
        if (lastUsed !== undefined) {
            wallet_list.push(lastUsed);
            wallet_list = wallet_list.filter(w => w.key !== lastUsed.key);
        }

        const installed = walletOptions.filter(w => w.isInstalledOnBrowser);
        installed.map(i => wallet_list.push(i));

        return wallet_list;
    }, [walletOptions]);

    return (
        <div className="w-full max-w-[480px] mx-auto flex flex-col gap-4 rounded border p-4">
            <div className="font-bold text-xl">{isProcessing ? 'processing...' : 'Connect'}</div>
            <button onClick={() => {
                console.log('walletOptions', walletOptions);
                const lastUsed = walletOptions.find(w => w.key === (localStorage.getItem('dynamic_last_used_wallet')?.replace(`"`, '')));
                console.log('filter', (localStorage.getItem('dynamic_last_used_wallet')?.replace(`"`, '')));
                console.log('lastUsed', lastUsed);
            }}>test</button>

            <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Google)}>Google</button>
            <div className="grid grid-cols-2 gap-4">
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Discord)}>Discord</button>
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Farcaster)}>Farcaster</button>
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Github)}>Github</button>
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Telegram)}>Telegram</button>
            </div>
            <hr className="border-gray-500" />

            {wallets.map(w =>
                <button className="flex gap-2 items-center bg-sky-500 hover:bg-sky-400 text-sky-100 px-4 py-2 rounded font-bold text-sm" onClick={() => selectWalletOption('metamask')}>
                    <WalletIcon walletKey={w.key} className="h-5" />
                    <div>{w.name}</div>
                </button>
            )}
        </div>
    );
}

export default Login;