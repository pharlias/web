import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainUpdatedsUser } from "@/graphql/domain-updateds.query";
import { DomainUpdatedsType } from "@/types/graphql/domain-updated.type";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

export const useDomainUpdatedsUser = () => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useQuery<DomainUpdatedsType>({
    queryKey: ["domainUpdatedsUser", address],
    queryFn: async (): Promise<DomainUpdatedsType> => {
      return await request<DomainUpdatedsType>(
        API_SUBGRAPH,
        queryDomainUpdatedsUser(address as HexAddress)
      );
    },
    enabled: !!address,
  });

  return {
    data: data?.domainUpdateds.items,
    isLoading,
    isError,
  };
}
