import { erc20Abi, parseEther, PublicClient, WalletClient } from "viem";
import { readContract } from "viem/actions";
import abi from '../resources/sepolia-staking-abi.json';
import { SmartAccountClient } from "permissionless";

interface Props {
    publicClient: PublicClient
    walletClient: WalletClient | SmartAccountClient
}

const useStakingContract = (props: Props) => {
    const contractAddress = '0x403f3b71e4F3D4A69c7ED5B152B6A0Ed30FE3e79';

    const totalStaked = async () => {
        console.log('totalStaked');
        try {
            if (props.publicClient === undefined) {
                throw 'Public client undefined';
            }
            const result = await readContract(props.publicClient, {
                address: contractAddress,
                abi: abi.abi,
                functionName: 'totalStaked',
                args: [],
            });
            console.log('useStakingContract.totalStaked', result);

            return result?.toString();
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    const stake = async (value: string) => {
        console.log('store');
        try {
            if (props.publicClient === undefined) {
                throw 'Public client undefined';
            }
            if (props.walletClient === undefined || props.walletClient.account?.address === undefined) {
                throw 'Wallet client undefined';
            }

            // Trigger allowance
            if (true) {
                const { request: approveRequest } = await props.publicClient.simulateContract({
                    address: contractAddress,
                    abi: erc20Abi,
                    functionName: 'approve',
                    args: [
                        props.walletClient.account?.address,
                        parseEther(value)
                    ],
                    account: props.walletClient.account
                });

                const approvalHash = await props.walletClient.writeContract(approveRequest);
                console.log('Approval hash:', approvalHash);

                const approvalReceipt = await props.publicClient.waitForTransactionReceipt({ hash: approvalHash, confirmations: 10 });
                console.log('Approval receipt', approvalReceipt);
            }
            
            const { request } = await props.publicClient.simulateContract({
                account: props.walletClient.account,
                address: contractAddress,
                abi: abi.abi,
                functionName: 'stake',
                args: [parseEther(value)]
            })
            const storeHash = await props.walletClient.writeContract(request);
            console.log('Stake hash', storeHash);
            return `Transaction executed`;

            // Not compatible for Safe
            // const storeReceipt = await props.publicClient.waitForTransactionReceipt({ hash: storeHash });
            // console.log('Store receipt', storeReceipt);
        } catch (error) {
            console.error(error);
            return 'error';
        }
    }

    return {
        totalStaked,
        stake
    };
}

export default useStakingContract;