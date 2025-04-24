import { ContractDomainNameNFT } from "@/constans/contracts";
import { DomainNameNFTABI } from "@/lib/abis/DomainNameNFTABI";
import api from "@/lib/api";
import { config } from "@/lib/wagmi";
import { CreatePNS } from "@/types/create-pns.type";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract, readContract } from "@wagmi/core";
import { useState } from "react";

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

        const registrationFee = await readContract(config, {
          address: ContractDomainNameNFT,
          abi: DomainNameNFTABI,
          functionName: "registrationFee",
        }) as bigint;

        const txHash = await writeContract(config, {
          address: ContractDomainNameNFT,
          abi: DomainNameNFTABI,
          functionName: "registerDomain",
          args: [
            `${name}.pharos`,
            response.metadataURI
          ],
          value: registrationFee,
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