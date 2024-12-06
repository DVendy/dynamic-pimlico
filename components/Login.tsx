import { useSocialAccounts } from "@dynamic-labs/sdk-react-core";
import { ProviderEnum } from "@dynamic-labs/types";

const Login = () => {
    const { error, isProcessing, signInWithSocialAccount } = useSocialAccounts();

    return (
        <div className="w-full max-w-[480px] mx-auto flex flex-col gap-4 rounded border p-4">
            <div className="font-bold text-xl">{isProcessing ? 'processing...' : 'Connect'}</div>
            <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Google)}>Google</button>
            <div className="grid grid-cols-2 gap-4">
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Discord)}>Discord</button>
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Farcaster)}>Farcaster</button>
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Github)}>Github</button>
                <button className="button" onClick={() => signInWithSocialAccount(ProviderEnum.Telegram)}>Telegram</button>
            </div>
            <hr className="border-gray-500" />
        </div>
    );
}

export default Login;