import { ContractRentRegistrar } from "@/constans/contracts";
import { RentRegistrarABI } from "@/lib/abis/RentRegistrarABI";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useState } from "react";
import { parseGwei } from "viem";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

export const useRegisterPNS = () => {
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
    }
  ]);

  const mutation = useMutation({
    mutationFn: async ({
      name,
      toAddress
    }: {
      name: string;
      toAddress: HexAddress;
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

        const txHash = await writeContract(config, {
          address: ContractRentRegistrar,
          abi: RentRegistrarABI,
          functionName: "transferOwnership",
          args: [
            `${name}`,
            toAddress
          ],
          gas: BigInt(300_000), 
          maxFeePerGas: parseGwei('10'), 
          maxPriorityFeePerGas: parseGwei('2'),
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(config, {
          hash: txHash
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
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