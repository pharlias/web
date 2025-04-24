"use client"

import '@rainbow-me/rainbowkit/styles.css';

import { JSX } from "react";
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { pharos, config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={pharos}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}