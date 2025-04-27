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

  // if data with same name exists, just use one with the find first data
  // if (data?.domainUpdateds.items) {
  //   const uniqueItems = data.domainUpdateds.items.reduce(
  //     (acc: DomainUpdatedsType["domainUpdateds"]["items"], item) => {
  //       const existingItem = acc.find((i) => i.name === item.name);
  //       if (!existingItem) {
  //         acc.push(item);
  //       }
  //       return acc;
  //     },
  //     []
  //   );
  //   data.domainUpdateds.items = uniqueItems;
  // }

  // console.log("domainUpdatedsUser", data?.domainUpdateds.items);

  return {
    data: data?.domainUpdateds.items,
    isLoading,
    isError,
  };
}
