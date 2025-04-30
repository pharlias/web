import { ContractNFTRegistrar } from "@/constans/contracts";
import { NFTRegistrarABI } from "@/lib/abis/NFTRegistrarABI";
import { NFTMetadata } from "@/types/nft-metadata.type";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

export const useNFTMetadata = (tokenId: string) => {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);

  const { data, isLoading } = useReadContract({
    address: ContractNFTRegistrar,
    abi: NFTRegistrarABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
    query: {
      enabled: !!tokenId,
      refetchInterval: 1000,
      retryDelay: 1000,
    }
  });

  const ipfsLink = typeof data === "string" ? data.replace("ipfs://", "https://ipfs.io/ipfs/") : undefined;

  useEffect(() => {
    const fetchMetadata = async () => {
      if (ipfsLink) {
        const response = await fetch(ipfsLink);
        const json = await response.json();
        setMetadata(json as NFTMetadata);
      }
    };
    fetchMetadata();
  }, [ipfsLink]);
  
  const imageUrl = metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");

  return { 
    data: metadata, 
    isLoading,
    name: metadata?.name,
    description: metadata?.description,
    image: imageUrl,
    attributes: metadata?.attributes,
  };
}