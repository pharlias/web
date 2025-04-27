import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainUpdateds } from "@/graphql/domain-updateds.query";
import { DomainUpdatedsType } from "@/types/graphql/domain-updated.type";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

export const useDomainUpdateds = () => {
  const { address } = useAccount();

  const { data, isLoading, isError } = useQuery<DomainUpdatedsType>({
    queryKey: ["domainUpdateds", address],
    queryFn: async (): Promise<DomainUpdatedsType> => {
      return await request<DomainUpdatedsType>(
        API_SUBGRAPH,
        queryDomainUpdateds()
      );
    },
    enabled: !!address,
  });

  // if data with same name exists, just use one with the find first data
  if (data?.domainUpdateds.items) {
    const uniqueItems = data.domainUpdateds.items.reduce(
      (acc: DomainUpdatedsType["domainUpdateds"]["items"], item) => {
        const existingItem = acc.find((i) => i.name === item.name);
        if (!existingItem) {
          acc.push(item);
        }
        return acc;
      },
      []
    );
    data.domainUpdateds.items = uniqueItems;
  }

  // then filter by address
  if (data?.domainUpdateds.items) {
    data.domainUpdateds.items = data.domainUpdateds.items.filter(
      (item) => item.owner === address
    );
  }

  return {
    data: data?.domainUpdateds.items,
    isLoading,
    isError,
  };
}
