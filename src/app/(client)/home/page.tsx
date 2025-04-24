"use client";
import { useState } from "react";
import { Column, Fade, IconButton, Text } from "@/ui/components";
import { ScrollToTop } from "@/ui/components/ScrollToTop";
import styles from "./page.module.scss";
import { PNS } from "@/types/pns.type";
import { DomainSearchSection } from "./_components/domain-search-section";
import { DomainDetailsSection } from "./_components/domain-details-section";
import { PageFooter } from "@/components/layout/footer";
import { PageBackground } from "@/components/layout/background";
import { useDomainRegistereds } from "@/hooks/query/graphql/useDomainRegistereds";

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState<PNS | null>(null);
  const { data, isLoading } = useDomainRegistereds();
  
  const checkDomainAvailability = (domainName: string) => {
    if (!domainName) return true;
    const fullDomainName = `${domainName}.pharos`;
    return !data?.some(domain => domain.domain.toLowerCase() === fullDomainName.toLowerCase());
  };

  const handleDomainSelect = (domain: PNS) => {
    const isAvailable = checkDomainAvailability(domain.name);
    setSelectedDomain({
      ...domain,
      available: isAvailable
    });
  };

  const handleReset = () => {
    setSelectedDomain(null);
  };


  return (
    <Column fillWidth paddingTop="80" paddingBottom="8" fillHeight paddingX="s" horizontal="center" flex={1} className={styles.container}>
      <ScrollToTop>
        <IconButton variant="secondary" icon="chevronUp" />
      </ScrollToTop>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        horizontal="center"
        border="neutral-alpha-weak"
        fillWidth
        fillHeight
        marginTop="8"
      >
        <Column
          fillWidth
          horizontal="center"
          gap="32"
          radius="xl"
          padding="32"
          position="relative"
          vertical="center"
          className={styles.contentContainer}
        >
          <PageBackground />
          <Text
            variant="body-strong-l"
            style={{
              fontSize: "30px",
              fontWeight: 700,
              textAlign: "center"
            }}
          >
            Pharos Name Service
          </Text>
          {selectedDomain && (
            <Text
              variant="body-strong-l"
              style={{
                fontSize: "20px",
                fontWeight: 700,
                textAlign: "center"
              }}
            >
              Domain is {selectedDomain.available ? "available!" : "not available!"}
            </Text>
          )}
          {!selectedDomain ? (
            <DomainSearchSection 
              onDomainSelect={handleDomainSelect} 
              checkAvailability={checkDomainAvailability}
              isLoading={isLoading}
            />
          ) : (
            <DomainDetailsSection domain={selectedDomain} onReset={handleReset} />
          )}
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}