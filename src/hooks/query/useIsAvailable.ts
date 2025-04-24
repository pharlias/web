import { ContractRentRegistrar } from "@/constans/contracts";
import { RentRegisterABI } from "@/lib/abis/RentRegister";
import { useReadContract } from "wagmi";

export const useIsAvailable = async ({
  name
}: {
  name?: string;
}) => {
  const { data, isLoading } = useReadContract<any, any, any>({
    address: ContractRentRegistrar,
    abi: RentRegisterABI,
    functionName: "isAvailable",
    args: [`${name}.pharos`],
    query: {
      enabled: !!name,
      refetchInterval: 3000,
    }
  });

  return {
    isAvailable: data,
    isLoading
  }
}