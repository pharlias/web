import { ContractNFTRegistrar } from "@/constans/contracts";
import { NFTRegistrarABI } from "@/lib/abis/NFTRegistrarABI";
import { useReadContract } from "wagmi";

export const useNFTMetadata = (tokenId: string) => {
  const { data, isLoading } = useReadContract({
    address: ContractNFTRegistrar,
    abi: NFTRegistrarABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  })

  return { data, isLoading };
}