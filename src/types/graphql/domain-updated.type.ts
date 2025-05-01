export type DomainUpdatedsType = {
  domainUpdateds: {
    items: Array<{
      id: string;
      name: string;
      owner: string;
      status: string;
      tokenId: string;
      expires: string;
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

export type DomainUpdatedsCurType = {
  id: string;
  name: string;
  owner: string;
  status: string;
  tokenId: string;
  expires: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}