import { useState, useEffect } from "react";

interface DomainAvailabilityResult {
  isChecking: boolean;
  availability: boolean | null;
  showResults: boolean;
}

export const useDomainAvailability = (domainName: string): DomainAvailabilityResult => {
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [availability, setAvailability] = useState<boolean | null>(null);

  useEffect(() => {
    if (domainName.trim()) {
      setIsChecking(true);
      const timeout = setTimeout(() => {
        const isAvailable = !domainName.toLowerCase().includes("taken");
        setAvailability(isAvailable);
        setIsChecking(false);
        setShowResults(true);
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setShowResults(false);
      setAvailability(null);
    }
  }, [domainName]);

  return { isChecking, availability, showResults };
};