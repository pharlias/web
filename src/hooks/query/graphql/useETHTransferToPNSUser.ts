import { API_SUBGRAPH } from "@/constans/env";
import { queryETHTransferToPNSs } from "@/graphql/eth-transfer-to-pns.query";
import { ETHTransferToPNSsType } from "@/types/graphql/eth-transfer-to-pns.type";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

export const useETHTransferToPNSUser = () => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useQuery<ETHTransferToPNSsType>({
    queryKey: ["eTHTransferToPNSUser", address],
    queryFn: async (): Promise<ETHTransferToPNSsType> => {
      return await request<ETHTransferToPNSsType>(
        API_SUBGRAPH,
        queryETHTransferToPNSs(address as string)
      );
    },
    enabled: !!address,
  });

  return {
    data: data?.eTHTransferToPNSs.items,
    isLoading,
    isError,
  };
}
