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