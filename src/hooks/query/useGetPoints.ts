import { ContractPharlias } from "@/constans/contracts";
import { PharliasABI } from "@/lib/abis/PharliasABI";
import { useAccount, useReadContract } from "wagmi";

export const useGetPoints = () => {
  const { address } = useAccount();

  const { data: points } = useReadContract({
    address: ContractPharlias,
    abi: PharliasABI,
    functionName: "getPoints",
    args: [
      address
    ],
    query: {
      enabled: !!address,
      refetchInterval: 2000,
      retryDelay: 2000,
    }
  });

  return { 
    points,
  };
}