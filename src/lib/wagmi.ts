import { appName, pharosChainId, pharosExplorer, pharosLogo, pharosRPC } from '@/constans/config'
import {
  getDefaultConfig,
  Chain
} from '@rainbow-me/rainbowkit'
import { http } from 'viem';
import { baseSepolia, holesky } from 'viem/chains';

export const pharos = {
  id: pharosChainId,
  name: 'Pharos Devnet',
  nativeCurrency: { name: 'Pharos Token', symbol: 'PTT', decimals: 18 },
  iconUrl: pharosLogo,
  iconBackground: '#fff',
  rpcUrls: {
    default: { http: [pharosRPC] },
    public: { http: [pharosRPC] }
  },
  blockExplorers: {
    default: { name: 'PharosScan', url: pharosExplorer },
  },
  testnet: true,
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: appName as string,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string || '',
  chains: [pharos, baseSepolia, holesky],
  transports: {
    [baseSepolia.id]: http("https://base-sepolia.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
    [holesky.id]: http("https://eth-holesky.g.alchemy.com/v2/EB6qgZ7mRkqjUt7xoI_d3V_AjZuUkFpg"),
  }
})