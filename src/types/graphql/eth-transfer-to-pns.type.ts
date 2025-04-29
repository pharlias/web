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