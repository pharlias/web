import { ContractPNSPaymentRouter } from "@/constans/contracts";
import { PNSPaymentRouterABI } from "@/lib/abis/PNSPaymentRouterABI";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useState } from "react";
import { parseEther, parseGwei } from "viem";

type Status = "idle" | "loading" | "success" | "error";

export const useTransferETHToPNS = () => {
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
      amount
    }: {
      name: string;
      amount: string;
    }) => {
      try {
        setSteps([
          { step: 1, status: "idle" }
        ]);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const nameWithPharos = name.endsWith('.pharos')
          ? name
          : `${name}.pharos`;

        const txHash = await writeContract(config, {
          address: ContractPNSPaymentRouter,
          abi: PNSPaymentRouterABI,
          functionName: "transferETHToPNS",
          args: [
            nameWithPharos
          ],
          value: parseEther(amount),
          gas: BigInt(300_000),
          maxFeePerGas: parseGwei('100'),
          maxPriorityFeePerGas: parseGwei('50'),
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