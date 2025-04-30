import { ContractRentRegistrar } from "@/constans/contracts";
import { RentRegistrarABI } from "@/lib/abis/RentRegistrarABI";
import { useReadContract } from "wagmi";

export const useIsAvailable = (name: string) => {
  const { data: isAvailable } = useReadContract({
    address: ContractRentRegistrar,
    abi: RentRegistrarABI,
    functionName: "isAvailable",
    args: [
      name
    ],
    query: {
      enabled: !!name,
      refetchInterval: 1000,
      retryDelay: 1000,
    }
  });

  return { 
    isAvailable,
  };
}