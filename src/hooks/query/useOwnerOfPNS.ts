import { ContractPNSPaymentRouter } from "@/constans/contracts";
import { PNSPaymentRouterABI } from "@/lib/abis/PNSPaymentRouterABI";
import { useReadContract } from "wagmi";

export const useOwnerOfPNS = (name: string) => {
  const { data: nodeHash } = useReadContract({
    address: ContractPNSPaymentRouter,
    abi: PNSPaymentRouterABI,
    functionName: "getNodeHash",
    args: [name],
  });

  const { data: address } = useReadContract({
    address: ContractPNSPaymentRouter,
    abi: PNSPaymentRouterABI,
    functionName: "resolvePNSNameToAddress",
    args: [
      name,
      nodeHash
    ],
  });

  return { 
    data: address,
  };
}