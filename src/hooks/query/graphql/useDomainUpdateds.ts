import { useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainUpdateds } from "@/graphql/domain-updateds.query";
import { DomainUpdatedsType } from "@/types/graphql/domain-updated.type";

export const useDomainUpdateds = () => {
  const { address } = useAccount();
  const allItemsRef = useRef<DomainUpdatedsType["domainUpdateds"]["items"]>([]);
  const hasNextPageRef = useRef<boolean>(false);
  const endCursorRef = useRef<string | null>(null);

  useEffect(() => {
    allItemsRef.current = [];
    endCursorRef.current = null;
    hasNextPageRef.current = true;
  }, [address]);

  const {
    data,
    isLoading: isInitialLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<DomainUpdatedsType>({
    queryKey: ["domainUpdateds", address, endCursorRef.current],
    queryFn: async () => {
      const result = await request<DomainUpdatedsType>(
        API_SUBGRAPH,
        queryDomainUpdateds(endCursorRef.current)
      );

      let newItems = result.domainUpdateds.items;

      if (address) {
        newItems = newItems.filter(item => item.owner === address);
      }

      const combinedItems = [...allItemsRef.current, ...newItems];
      allItemsRef.current = combinedItems;
      hasNextPageRef.current = result.domainUpdateds.pageInfo.hasNextPage;
      endCursorRef.current = result.domainUpdateds.pageInfo.endCursor;

      return result;
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPageRef.current || !address || isFetching) {
      return;
    }
    await refetch();
  }, [address, refetch, isFetching]);

  const fetchAllPages = useCallback(async () => {
    if (!address || isFetching) {
      return;
    }

    while (hasNextPageRef.current) {
      const result = await request<DomainUpdatedsType>(
        API_SUBGRAPH,
        queryDomainUpdateds(endCursorRef.current)
      );

      let newItems = result.domainUpdateds.items;
      if (address) {
        newItems = newItems.filter(item => item.owner === address);
      }

      const combinedItems = [...allItemsRef.current, ...newItems];
      allItemsRef.current = combinedItems;
      hasNextPageRef.current = result.domainUpdateds.pageInfo.hasNextPage;
      endCursorRef.current = result.domainUpdateds.pageInfo.endCursor;

      if (!result.domainUpdateds.pageInfo.hasNextPage) {
        break;
      }
    }
  }, [address, isFetching]);

  const processedData = useMemo(() => {
    if (!allItemsRef.current.length) {
      return [];
    }

    const uniqueItems = allItemsRef.current.reduce(
      (acc: DomainUpdatedsType["domainUpdateds"]["items"], item) => {
        const existingItem = acc.find(i => i.name === item.name);
        if (!existingItem) {
          acc.push(item);
        }
        return acc;
      },
      []
    );

    return address
      ? uniqueItems.filter(item => item.owner === address)
      : uniqueItems;
  }, [allItemsRef.current, address]);

  return {
    data: processedData,
    rawData: allItemsRef.current,
    isLoading: isInitialLoading || isFetching,
    isError,
    hasNextPage: hasNextPageRef.current,
    fetchNextPage,
    fetchAllPages,
    totalCount: data?.domainUpdateds.totalCount ?? 0,
    pageInfo: data?.domainUpdateds.pageInfo,
  };
};