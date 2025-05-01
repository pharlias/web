export type DomainRegisteredsType = {
  domainRegistereds: {
    items: Array<{
      blockNumber: string;
      blockTimestamp: string;
      expires: string;
      name: string;
      id: string;
      owner: string;
      tokenId: string;
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

export type NFTType = {
  blockNumber: string;
  blockTimestamp: string;
  expires: string;
  name: string;
  id: string;
  owner: string;
  tokenId: string;
  transactionHash: string;
}