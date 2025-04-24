import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainRegistereds } from "@/graphql/domain-registereds.query";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

export const useDomainRegistereds = () => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useQuery<DomainList>({
    queryKey: ["domainRegistereds", address],
    queryFn: async (): Promise<DomainList> => {
      const query = queryDomainRegistereds(address as string);
      const res = await request<{ domainRegistereds: DomainList }>(API_SUBGRAPH, query);
      return res.domainRegistereds;
    },
    enabled: !!address,
  });

  return {
    data: data?.items,
    isLoading,
    isError,
  };
}