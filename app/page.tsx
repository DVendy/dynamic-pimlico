'use client';

import Login from "@/components/Login";
import Main from "@/components/Main";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();

  return (
    <div className="container mx-auto p-8 flex flex-col items-start gap-4">
      <div className="w-full">
        <DynamicWidget />
      </div>
      {account.isConnected ?
        <Main
          account={account}
        />
        : <Login />
      }
    </div>
  );
}
