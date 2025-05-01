import { useDomainUpdatedsUser } from "./graphql/useDomainUpdatedsUser";
import { useETHTransferToPNSUser } from "./graphql/useETHTransferToPNSUser";

export const useGetPoints = () => {
  const { data: domains } = useDomainUpdatedsUser();
  const { data: transfers } = useETHTransferToPNSUser();

  const points = (domains?.length || 0) * 20 + (transfers?.length || 0) * 5;

  return {
    points
  };
}