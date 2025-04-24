import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
type Status = "idle" | "loading" | "success" | "error";

export const useGenerateImage = () => {
  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([{ step: 1, status: "idle" }]);

  const [result, setResult] = useState<any | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      setSteps([{ step: 1, status: "loading" }]);
      const response = await api.get(`generate-image?name=${name}.pharos`);
      return response as any;
    },
    onSuccess: (data) => {
      setResult(data);
      setSteps([{ step: 1, status: "success" }]);
    },
    onError: (e: unknown) => {
      console.error("Error", e);
      setResult(null);
      setSteps([{ step: 1, status: "error", error: (e as Error).message }]);
    },
  });

  return {
    steps,
    mutation,
    result,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess
  };
};