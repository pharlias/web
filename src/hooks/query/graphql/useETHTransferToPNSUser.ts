import { useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { useAccount } from "wagmi";

import { API_SUBGRAPH } from "@/constans/env";
import { queryETHTransferToPNSs } from "@/graphql/eth-transfer-to-pns.query";
import { ETHTransferToPNSsType } from "@/types/graphql/eth-transfer-to-pns.type";

export const useETHTransferToPNSUser = () => {
  const { address } = useAccount();
  const allItemsRef = useRef<ETHTransferToPNSsType["eTHTransferToPNSs"]["items"]>([]);
  const hasNextPageRef = useRef<boolean>(true);
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
  } = useQuery<ETHTransferToPNSsType>({
    queryKey: ["eTHTransferToPNSUser", address, endCursorRef.current],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address is required");
      }

      const result = await request<ETHTransferToPNSsType>(
        API_SUBGRAPH,
        queryETHTransferToPNSs(address, endCursorRef.current || "")
      );

      allItemsRef.current = [...allItemsRef.current, ...result.eTHTransferToPNSs.items];
      hasNextPageRef.current = result.eTHTransferToPNSs.pageInfo.hasNextPage;
      endCursorRef.current = result.eTHTransferToPNSs.pageInfo.endCursor;

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

      const result = await request<ETHTransferToPNSsType>(
        API_SUBGRAPH,
        queryETHTransferToPNSs(address, endCursorRef.current || "")
      );

      allItemsRef.current = [...allItemsRef.current, ...result.eTHTransferToPNSs.items];
      hasNextPageRef.current = result.eTHTransferToPNSs.pageInfo.hasNextPage;
      endCursorRef.current = result.eTHTransferToPNSs.pageInfo.endCursor;

      if (!result.eTHTransferToPNSs.pageInfo.hasNextPage) {
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
    totalCount: data?.eTHTransferToPNSs.totalCount ?? 0,
    pageInfo: data?.eTHTransferToPNSs.pageInfo,
  };
};