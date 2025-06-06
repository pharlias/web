import { ContractRentRegistrar } from "@/constans/contracts";
import { RentRegistrarABI } from "@/lib/abis/RentRegistrarABI";
import api from "@/lib/api";
import { config } from "@/lib/wagmi";
import { CreatePNS } from "@/types/create-pns.type";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract, readContract } from "@wagmi/core";
import { useState } from "react";
import { parseGwei } from "viem";
import { useAccount } from "wagmi";

type Status = "idle" | "loading" | "success" | "error";
type HexAddress = `0x${string}`;

export const useRegisterPNS = () => {
  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const { address } = useAccount()

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
      name
    }: {
      name: string;
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

        const response: CreatePNS = await api.post(`create-pns`, { name: `${name}.pharos` });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const price = await readContract(config, {
          address: ContractRentRegistrar,
          abi: RentRegistrarABI,
          functionName: "rentPrice",
          args: [
            BigInt(1),
            `${name}`,
          ]
        }) as bigint;

        const txHash = await writeContract(config, {
          address: ContractRentRegistrar,
          abi: RentRegistrarABI,
          functionName: "register",
          args: [
            `${name}`,
            address,
            BigInt(1),
            response.metadataURI
          ],
          value: price,
          gas: BigInt(500_000),
          maxFeePerGas: parseGwei('20'), 
          maxPriorityFeePerGas: parseGwei('4'),
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(config, {
          hash: txHash
        });

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