import { useState, useEffect } from "react";
import { Badge, Column, Icon, Input, Text, Row, Button, Spinner } from "@/ui/components";
import styles from "../page.module.scss";
import { PNS } from "@/types/pns.type";
import ConnectButtonWrapper from "@/components/rainbow-kit/connect-button-wrapper";
import { useAccount } from "wagmi";

interface DomainSearchSectionProps {
  onDomainSelect: (domain: PNS) => void;
  checkAvailability: (domainName: string) => boolean;
  isLoading: boolean;
}

export const DomainSearchSection = ({
  onDomainSelect,
  checkAvailability,
  isLoading
}: DomainSearchSectionProps) => {
  const [domainName, setDomainName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentAvailability, setCurrentAvailability] = useState<boolean | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const { isConnected } = useAccount();

  useEffect(() => {
    if (domainName.trim().length > 0) {
      const baseName = domainName.trim().toLowerCase();
      const newSuggestions = [
        `my${baseName}`,
        `${baseName}dao`,
        `${baseName}nft`,
        `${baseName}web3`,
      ];
      setSuggestions(newSuggestions);

      setCurrentAvailability(checkAvailability(baseName));
      setSelectedDomain(null);
    } else {
      setSuggestions([]);
      setCurrentAvailability(null);
      setSelectedDomain(null);
    }
  }, [domainName, checkAvailability]);

  const calculatePrice = (name: string) => {
    const basePrice = 0.0001;
    const lengthFactor = Math.max(1, 10 - name.length) * 0.00001;
    return (basePrice + lengthFactor).toFixed(4);
  };

  const handleSelectDomain = () => {
    if (domainName.trim()) {
      const isAvailable = checkAvailability(domainName);

      if (isAvailable) {
        setSelectedDomain(domainName);
        onDomainSelect({
          name: domainName,
          price: calculatePrice(domainName),
          available: isAvailable,
          duration: "1 year",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedInput = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (sanitizedInput.length > 10) {
      setDomainName(sanitizedInput.slice(0, 10));
      return;
    }
    setDomainName(sanitizedInput);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setDomainName(suggestion);
    if (checkAvailability(suggestion)) {
      setSelectedDomain(suggestion);
      onDomainSelect({
        name: suggestion,
        price: calculatePrice(suggestion),
        available: true,
        duration: "1 year"
      });
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
                      ? `Available | ~${calculatePrice(domainName)} ETH`
                      : "Already Taken"
                  ) : (
                    `Check Availability | ~${calculatePrice(domainName)} ETH`
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
                  const suggestionAvailable = checkAvailability(suggestion);
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