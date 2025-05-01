import { useEffect, useState } from "react";
import { useDomainUpdatedsUser } from "./graphql/useDomainUpdatedsUser";
import { useETHTransferToPNSUser } from "./graphql/useETHTransferToPNSUser";

export const useGetPoints = () => {
  const [points, setPoints] = useState(0);

  const { data: domains } = useDomainUpdatedsUser();
  const { data: transfers } = useETHTransferToPNSUser();

  useEffect(() => {
    if (domains.length > 0 || transfers.length > 0) {
      setPoints((domains?.length || 0) * 20 + (transfers?.length || 0) * 5);
    }
  }, [domains, transfers]);

  return {
    points
  };
}