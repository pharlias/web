import { useState, useEffect } from "react";
import { Badge, Column, Icon, Input, Text, Row, Button, Spinner } from "@/ui/components";
import styles from "../page.module.scss";
import ConnectButtonWrapper from "@/components/rainbow-kit/connect-button-wrapper";
import { useAccount } from "wagmi";
import { pharosNativeToken } from "@/constans/config";
import { readContract } from "@wagmi/core";
import { config } from "@/lib/wagmi";
import { ContractRentRegistrar } from "@/constans/contracts";
import { RentRegistrarABI } from "@/lib/abis/RentRegistrarABI";

interface DomainSearchSectionProps {
  onDomainSelect: (domain: { name: string; price: string; available: boolean; duration: string }) => void;
}

export const DomainSearchSection = ({ onDomainSelect }: DomainSearchSectionProps) => {
  const [domainName, setDomainName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentAvailability, setCurrentAvailability] = useState<boolean | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionAvailability, setSuggestionAvailability] = useState<Record<string, boolean>>({});

  const { isConnected } = useAccount();

  const checkAvailability = async (domain: string) => {
    try {
      setIsLoading(true);
      const isAvailable = await readContract(config, {
        address: ContractRentRegistrar,
        abi: RentRegistrarABI,
        functionName: "isAvailable",
        args: [domain],
      });
      return !!isAvailable;
    } catch (error) {
      console.error("Error checking domain availability:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkMainDomainAvailability = async () => {
      if (domainName.trim().length > 0) {
        const baseName = domainName.trim().toLowerCase();
        const newSuggestions = [
          `my${baseName}`,
          `${baseName}dao`,
          `${baseName}nft`,
          `${baseName}web3`,
        ];
        setSuggestions(newSuggestions);

        // Check main domain availability
        setIsLoading(true);
        try {
          const isAvailable = await readContract(config, {
            address: ContractRentRegistrar,
            abi: RentRegistrarABI,
            functionName: "isAvailable",
            args: [domainName],
          });
          setCurrentAvailability(!!isAvailable);
        } catch (error) {
          console.error("Error checking availability:", error);
          setCurrentAvailability(null);
        } finally {
          setIsLoading(false);
        }
        setSelectedDomain(null);
      } else {
        setSuggestions([]);
        setCurrentAvailability(null);
        setSelectedDomain(null);
      }
    };

    checkMainDomainAvailability();
  }, [domainName]);

  useEffect(() => {
    const checkSuggestionAvailability = async () => {
      if (suggestions.length > 0) {
        const availabilityResults: Record<string, boolean> = {};
        for (const suggestion of suggestions) {
          availabilityResults[suggestion] = await checkAvailability(suggestion);
        }
        setSuggestionAvailability(availabilityResults);
      }
    };

    if (isConnected && suggestions.length > 0) {
      checkSuggestionAvailability();
    }
  }, [suggestions, isConnected]);

  const calculatePrice = (name: string) => {
    const length = name.length;
    if (length <= 3) {
      return "1.0";
    }
    if (length <= 5) {
      return "0.8";
    }
    if (length <= 9) {
      return "0.5";
    }
    return "0.1";
  };

  const handleSelectDomain = async () => {
    if (domainName.trim()) {
      setIsLoading(true);
      try {
        const isAvailable = await readContract(config, {
          address: ContractRentRegistrar,
          abi: RentRegistrarABI,
          functionName: "isAvailable",
          args: [domainName],
        });

        if (isAvailable) {
          setSelectedDomain(domainName);
          onDomainSelect({
            name: domainName,
            price: calculatePrice(domainName),
            available: true,
            duration: "1 year"
          });
        } else {
          setCurrentAvailability(false);
        }
      } catch (error) {
        console.error("Error selecting domain:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedInput = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (sanitizedInput.length > 12) {
      setDomainName(sanitizedInput.slice(0, 12));
      return;
    }
    setDomainName(sanitizedInput);
  };

  const handleSelectSuggestion = async (suggestion: string) => {
    setDomainName(suggestion);
    setIsLoading(true);
    
    try {
      const isAvailable = await checkAvailability(suggestion);
      if (isAvailable) {
        setSelectedDomain(suggestion);
        onDomainSelect({
          name: suggestion,
          price: calculatePrice(suggestion),
          available: true,
          duration: "1 year"
        });
      }
    } catch (error) {
      console.error("Error selecting suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSelectionComplete = selectedDomain !== null;

  return (
    <Column horizontal="center" gap="20" vertical="center" position="relative" fillWidth>
      <Input
        id="domain-name"
        label="Search Name"
        value={domainName}
        onChange={handleInputChange}
        className={styles.inputName}
        height="m"
        disabled={isSelectionComplete}
        hasSuffix={
          <Icon name="search" />
        }
        style={{
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />
      {domainName.trim() && (
        <Column gap="12" fillWidth style={{ maxWidth: "400px" }}>
          <ConnectButtonWrapper>
            <Badge
              fillWidth
              arrow={currentAvailability === true && !isSelectionComplete ? true : false}
              style={{
                width: "100%",
                cursor: isSelectionComplete || currentAvailability !== true ? "default" : "pointer",
                justifyContent: "space-between",
                backgroundColor: currentAvailability === true
                  ? isSelectionComplete && selectedDomain === domainName
                    ? "rgba(0, 255, 0, 0.3)"
                    : "rgba(0, 255, 0, 0.1)"
                  : currentAvailability === false
                    ? "rgba(255, 0, 0, 0.1)"
                    : undefined,
                opacity: isSelectionComplete && selectedDomain !== domainName ? 0.5 : 1
              }}
              onClick={isSelectionComplete || !currentAvailability ? undefined : handleSelectDomain}
            >
              <Row fillWidth horizontal="space-between" vertical="center">
                <Text>
                  {domainName}.pharos
                </Text>
                <Text>
                  {isLoading ? (
                    "Checking..."
                  ) : isSelectionComplete && selectedDomain === domainName ? (
                    "Selected"
                  ) : currentAvailability !== null ? (
                    currentAvailability
                      ? `Available | ~${calculatePrice(domainName)} ${pharosNativeToken}`
                      : "Already Taken"
                  ) : (
                    `Check Availability | ~${calculatePrice(domainName)} ${pharosNativeToken}`
                  )}
                </Text>
              </Row>
            </Badge>
          </ConnectButtonWrapper>
          {isConnected && suggestions.length > 0 && !isSelectionComplete && (
            <Column gap="8" fillWidth>
              <Text style={{ opacity: 0.7 }}>
                Similar Domains:
              </Text>
              <Row gap="8" style={{ flexWrap: "wrap" }}>
                {suggestions.map((suggestion, index) => {
                  const suggestionAvailable = suggestionAvailability[suggestion] || false;
                  return (
                    <Button
                      key={index}
                      variant={suggestionAvailable ? "secondary" : "tertiary"}
                      id={`suggestion-${index}`}
                      disabled={isSelectionComplete}
                      style={{
                        cursor: suggestionAvailable && !isSelectionComplete ? "pointer" : "default",
                        opacity: suggestionAvailable ? 0.8 : 0.5,
                        transition: "all 0.2s ease"
                      }}
                      onClick={suggestionAvailable ? () => handleSelectSuggestion(suggestion) : undefined}
                    >
                      <Text>{suggestion}.pharos</Text>
                      {isLoading ? (
                        <Spinner size="xs" style={{ marginLeft: 4 }} />
                      ) : (
                        <Icon
                          name={suggestionAvailable ? "check" : "x"}
                          size="s"
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </Button>
                  );
                })}
              </Row>
            </Column>
          )}
          {isSelectionComplete && selectedDomain && (
            <Row horizontal="end" fillWidth>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedDomain(null);
                }}
              >
                Change Selection
              </Button>
            </Row>
          )}
        </Column>
      )}
      {!domainName.trim() && (
        <Text style={{ opacity: 0.7, textAlign: "center" }}>
          Enter a name to check availability and register your .pharos domain
        </Text>
      )}
    </Column>
  );
};