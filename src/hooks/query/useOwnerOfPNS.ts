import { ContractPNSPaymentRouter } from "@/constans/contracts";
import { PNSPaymentRouterABI } from "@/lib/abis/PNSPaymentRouterABI";
import { useReadContract } from "wagmi";

export const useOwnerOfPNS = (name: string) => {
  const { data: nodeHash } = useReadContract({
    address: ContractPNSPaymentRouter,
    abi: PNSPaymentRouterABI,
    functionName: "getNodeHash",
    args: [name],
    query: {
      enabled: !!name,
      refetchInterval: 2000,
      retryDelay: 2000,
    }
  });

  const { data: address } = useReadContract({
    address: ContractPNSPaymentRouter,
    abi: PNSPaymentRouterABI,
    functionName: "resolvePNSNameToAddress",
    args: [
      name,
      nodeHash
    ],
    query: {
      enabled: !!nodeHash,
      refetchInterval: 2000,
      retryDelay: 2000,
    }
  });

  return { 
    data: address,
  };
}