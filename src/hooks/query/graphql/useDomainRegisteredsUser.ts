import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainRegisteredsUser } from "@/graphql/domain-registereds.query";
import { DomainRegisteredsType } from "@/types/graphql/domain-registereds.type";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

export const useDomainRegisteredsUser = () => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useQuery<DomainRegisteredsType>({
    queryKey: ["domainRegisteredsUser", address],
    queryFn: async (): Promise<DomainRegisteredsType> => {
      return await request<DomainRegisteredsType>(
        API_SUBGRAPH,
        queryDomainRegisteredsUser(address as string)
      );
    },
    enabled: !!address,
  });

  return {
    data: data?.domainRegistereds.items,
    isLoading,
    isError,
  };
}
