"use client"
import { useDomainRegisteredsUser } from '@/hooks/query/graphql/useDomainRegisteredsUser';
import { Button, Column, Fade, Flex, IconButton, Input, Select, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React, { useState } from 'react';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import styles from "./page.module.scss";

export default function Page() {
  const { data } = useDomainRegisteredsUser();
  const [selectedDomain, setSelectedDomain] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const handleDomainSelect = (value: string) => {
    setSelectedDomain(value);
    console.log("Selected domain:", value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRecipientAddress(value);
    console.log("Recipient address:", value);
  };

  const handleTransfer = () => {
    if (!selectedDomain) {
      alert("Please select a domain to transfer");
      return;
    }

    if (!recipientAddress) {
      alert("Please enter a recipient address");
      return;
    }

    console.log(`Transferring domain ${selectedDomain} to ${recipientAddress}`);
    // Add actual transfer logic here
  };

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const domainOptions = data ? data.map(domain => ({
    label: `${domain.name}.pharos`,
    value: `${domain.name}.pharos`, // Changed from domain.id to domain name
    description: `Token id: ${domain.tokenId.length > 4 ? `${domain.tokenId.slice(0, 4)}...${domain.tokenId.slice(-4)}` : domain.tokenId} - Owner: ${shortenAddress(domain.owner)}`,
  })) : [];

  return (
    <Column fillWidth paddingTop="80" paddingBottom="8" paddingX="s" horizontal="center" flex={1} className={styles.container}>
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
          vertical="start"
          className={styles.contentContainer}
        >
          <PageBackground />

          <Text variant="heading-default-l" marginY="24" paddingX="24">
            Transfer your Pharos Name Service Here
          </Text>

          <Flex
            horizontal="center"
            fillWidth
          >
            <Flex
              direction="column"
              gap="24"
              fillWidth
              paddingBottom="160"
              horizontal="center"
              style={{
                maxWidth: "400px",
                width: "100%",
              }}
            >
              <Select
                id="nft"
                label="Select Domain to Transfer"
                options={domainOptions.length > 0 ? domainOptions : [
                  {
                    label: "No domains found",
                    value: "",
                    description: "You don't have any registered domains yet"
                  }
                ]}
                value={selectedDomain}
                onSelect={handleDomainSelect}
              />

              <Input
                id="address"
                label="Recipient Address"
                value={recipientAddress}
                labelAsPlaceholder={false}
                onChange={handleAddressChange}
              />

              <Button
                onClick={handleTransfer}
                disabled={!selectedDomain || !recipientAddress}
                fillWidth
              >
                Transfer Domain
              </Button>
            </Flex>
          </Flex>
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}