export type ETHTransferToPNSsType = {
  eTHTransferToPNSs: {
    items: Array<{
      id: string;
      name: string;
      sender: string;
      amount: string;
      blockNumber: string;
      blockTimestamp: string;
      transactionHash: string;
    }>
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    totalCount: number;
  };
}

export type ETHTransferToPNSsCurType = {
  id: string;
  name: string;
  sender: string;
  amount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}