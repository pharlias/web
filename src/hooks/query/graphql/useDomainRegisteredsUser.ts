import { useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { API_SUBGRAPH } from "@/constans/env";
import { queryDomainRegisteredsUser } from "@/graphql/domain-registereds.query";
import { DomainRegisteredsType } from "@/types/graphql/domain-registereds.type";

export const useDomainRegisteredsUser = () => {
  const { address } = useAccount();
  const allItemsRef = useRef<DomainRegisteredsType["domainRegistereds"]["items"]>([]);
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
  } = useQuery<DomainRegisteredsType>({
    queryKey: ["domainRegisteredsUser", address, endCursorRef.current],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address is required");
      }

      const result = await request<DomainRegisteredsType>(
        API_SUBGRAPH,
        queryDomainRegisteredsUser(address, endCursorRef.current)
      );

      allItemsRef.current = [...allItemsRef.current, ...result.domainRegistereds.items];
      hasNextPageRef.current = result.domainRegistereds.pageInfo.hasNextPage;
      endCursorRef.current = result.domainRegistereds.pageInfo.endCursor;

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

      const result = await request<DomainRegisteredsType>(
        API_SUBGRAPH,
        queryDomainRegisteredsUser(address, endCursorRef.current || "")
      );

      allItemsRef.current = [...allItemsRef.current, ...result.domainRegistereds.items];
      hasNextPageRef.current = result.domainRegistereds.pageInfo.hasNextPage;
      endCursorRef.current = result.domainRegistereds.pageInfo.endCursor;

      if (!result.domainRegistereds.pageInfo.hasNextPage) {
        break;
      }
    }
  }, [address, isFetching]);

  const processedData = useMemo(() => {
    return allItemsRef.current;
  }, [allItemsRef.current]);

  return {
    data: processedData,
    rawData: allItemsRef.current,
    isLoading: isInitialLoading || isFetching,
    isError,
    hasNextPage: hasNextPageRef.current,
    fetchNextPage,
    fetchAllPages,
    totalCount: data?.domainRegistereds.totalCount ?? 0,
    pageInfo: data?.domainRegistereds.pageInfo,
  };
};