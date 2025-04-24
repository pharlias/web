import { ContractDomainNameNFT } from "@/constans/contracts";
import { DomainNameNFTABI } from "@/lib/abis/DomainNameNFTABI";
import { useReadContract } from "wagmi";

export const useNFTMetadata = (tokenId: string) => {
  const { data, isLoading } = useReadContract({
    address: ContractDomainNameNFT,
    abi: DomainNameNFTABI,
    functionName: "tokenURI",
    args: [tokenId],
  })

  return { data, isLoading };
}