import { ContractNFTRegistrar, ContractRentRegistrar } from "@/constans/contracts";
import { NFTRegistrarABI } from "@/lib/abis/NFTRegistrarABI";
import { RentRegistrarABI } from "@/lib/abis/RentRegistrarABI";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useState } from "react";
import { parseGwei } from "viem";

type Status = "idle" | "loading" | "success" | "error";

export const useTransferOwnership = () => {
  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([
    {
      step: 1,
      status: "idle",
    },
    {
      step: 2,
      status: "idle",
    }
  ]);

  const mutation = useMutation({
    mutationFn: async ({
      name,
      recipient
    }: {
      name: string;
      recipient: HexAddress;
    }) => {
      try {
        setSteps([
          { step: 1, status: "idle" },
          { step: 2, status: "idle" }
        ]);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const approveHash = await writeContract(config, {
          address: ContractNFTRegistrar,
          abi: NFTRegistrarABI,
          functionName: "setApprovalForAll",
          args: [
            ContractRentRegistrar,
            true
          ],
          gas: BigInt(300_000),
          maxFeePerGas: parseGwei('10'),
          maxPriorityFeePerGas: parseGwei('2'),
        });

        const resultApprove = await waitForTransactionReceipt(config, {
          hash: approveHash
        });

        if (!resultApprove) {
          console.error("Failed to approve NFT");
          throw new Error("Failed to approve NFT");
        }

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        const nameCleared = name.endsWith('.pharos')
          ? name.split('.')[0]
          : name;

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const txHash = await writeContract(config, {
          address: ContractRentRegistrar,
          abi: RentRegistrarABI,
          functionName: "transferOwnership",
          args: [
            nameCleared,
            recipient
          ],
          gas: BigInt(300_000),
          maxFeePerGas: parseGwei('20'),
          maxPriorityFeePerGas: parseGwei('5'),
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(config, {
          hash: txHash
        });

        console.log("Transaction approve result:", result);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        return result;
      } catch (e) {
        console.error("Error", e);
        setSteps((prev) =>
          prev.map((step) => {
            if (step.status === "loading") {
              return { ...step, status: "error", error: (e as Error).message };
            }
            return step;
          })
        );
        throw e;
      }
    },
  });

  return { steps, mutation, txHash };
};