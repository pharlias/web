export type DomainRegisteredsType = {
  domainRegistereds: {
    items: Array<{
      blockNumber: string;
      blockTimestamp: string;
      domain: string;
      id: string;
      expiresAt: string;
      owner: string;
      tokenId: string;
      transactionHash: string;
    }>
  };
}

export type NFTType = {
  blockNumber: string;
  blockTimestamp: string;
  domain: string;
  id: string;
  expiresAt: string;
  owner: string;
  tokenId: string;
  transactionHash: string;
}