import { useState, useEffect } from "react";
import { Badge, Column, Icon, Input, Text, Row, Button } from "@/ui/components";
import styles from "../page.module.scss";
import { PNS } from "@/types/pns.type";
import { useDomainAvailability } from "@/hooks/domain/useDomainAvailability";

interface DomainSearchSectionProps {
  onDomainSelect: (domain: PNS) => void;
}

export const DomainSearchSection = ({ onDomainSelect }: DomainSearchSectionProps) => {
  const [domainName, setDomainName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { isChecking, availability, showResults } = useDomainAvailability(domainName);

  useEffect(() => {
    if (domainName.trim().length > 0) {
      const baseName = domainName.trim().toLowerCase();
      const newSuggestions = [
        baseName,
        `my${baseName}`,
        `${baseName}dao`,
        `${baseName}nft`,
        `${baseName}web3`,
      ].filter(name => name !== baseName);

      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [domainName]);

  const calculatePrice = (name: string) => {
    const basePrice = 0.0001;
    const lengthFactor = Math.max(1, 10 - name.length) * 0.001;
    return (basePrice + lengthFactor).toFixed(3);
  };

  const handleSelectDomain = (name: string = domainName) => {
    onDomainSelect({
      name,
      available: availability || false,
      price: calculatePrice(name),
      duration: "1 year"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedInput = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    setDomainName(sanitizedInput);
  };

  return (
    <Column horizontal="center" gap="20" vertical="center" position="relative" fillWidth>
      <Input
        id="domain-name"
        label="Search Name"
        value={domainName}
        onChange={handleInputChange}
        className={styles.inputName}
        height="m"
        hasSuffix={isChecking ?
          <Icon name="loader" className={styles.spinningIcon} /> :
          <Icon name="search" />
        }
        style={{
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      />

      {showResults && domainName.trim() && (
        <Column gap="12" fillWidth style={{ maxWidth: "400px" }}>
          <Badge
            fillWidth
            arrow
            style={{
              width: "100%",
              cursor: "pointer",
              justifyContent: "space-between",
              backgroundColor: availability ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
            }}
            onClick={() => handleSelectDomain()}
          >
            <Row fillWidth horizontal="space-between" vertical="center">
              <Text>
                {domainName}.pharos
              </Text>
              <Text>
                {availability ? "Available" : "Unavailable"} | ~{calculatePrice(domainName)} ETH
              </Text>
            </Row>
          </Badge>

          {suggestions.length > 0 && (
            <Column gap="8" fillWidth>
              <Text style={{ opacity: 0.7 }}>
                Similar Domains:
              </Text>
              <Row gap="8" style={{ flexWrap: "wrap" }}>
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    id={`suggestion-${index}`}
                    style={{
                      cursor: "pointer",
                      opacity: 0.8,
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => handleSelectDomain(suggestion)}
                  >
                    <Text>{suggestion}.pharos</Text>
                  </Button>
                ))}
              </Row>
            </Column>
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