import { NFTType } from "@/types/graphql/domain-registereds.type";
import { useState, useEffect } from "react";

export const useDomainUsed = () => {
  const [usedDomain, setUsedDomain] = useState<NFTType | null>(null);

  useEffect(() => {
    const storedDomain = localStorage.getItem('usedDomain');
    if (storedDomain) {
      setUsedDomain(JSON.parse(storedDomain));
    }
  }, []);

  return {
    blockNumber: usedDomain?.blockNumber,
    blockTimestamp: usedDomain?.blockTimestamp,
    expires: usedDomain?.expires,
    tokenId: usedDomain?.tokenId,
    owner: usedDomain?.owner,
    name: usedDomain?.name,
    id: usedDomain?.id,
  };
}
