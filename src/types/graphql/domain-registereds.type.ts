type DomainItem = {
  blockNumber: number;
  blockTimestamp: string;
  domain: string;
  id: string;
  expiresAt: string;
  owner: string;
  tokenId: string;
  transactionHash: string;
};

type DomainList = {
  items: DomainItem[];
};