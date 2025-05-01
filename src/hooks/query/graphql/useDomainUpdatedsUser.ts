import { useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainUpdatedsUser } from "@/graphql/domain-updateds.query";
import { DomainUpdatedsType } from "@/types/graphql/domain-updated.type";

export const useDomainUpdatedsUser = () => {
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
    queryKey: ["domainUpdatedsUser", address, endCursorRef.current],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address is required");
      }

      const result = await request<DomainUpdatedsType>(
        API_SUBGRAPH,
        queryDomainUpdatedsUser(address as HexAddress, endCursorRef.current)
      );

      allItemsRef.current = [...allItemsRef.current, ...result.domainUpdateds.items];
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
      if (!address) break;

      const result = await request<DomainUpdatedsType>(
        API_SUBGRAPH,
        queryDomainUpdatedsUser(address as HexAddress, endCursorRef.current)
      );

      allItemsRef.current = [...allItemsRef.current, ...result.domainUpdateds.items];
      hasNextPageRef.current = result.domainUpdateds.pageInfo.hasNextPage;
      endCursorRef.current = result.domainUpdateds.pageInfo.endCursor;

      if (!result.domainUpdateds.pageInfo.hasNextPage) {
        break;
      }
    }
  }, [address, isFetching]);

  const processedData = useMemo(() => {
    return allItemsRef.current;
  }, [allItemsRef.current]);

  return {
    data: processedData,
    isLoading: isInitialLoading || isFetching,
    isError,
    hasNextPage: hasNextPageRef.current,
    fetchNextPage,
    fetchAllPages,
    totalCount: data?.domainUpdateds.totalCount ?? 0,
    pageInfo: data?.domainUpdateds.pageInfo,
  };
};