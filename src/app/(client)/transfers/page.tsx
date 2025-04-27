"use client"
import { Button, Column, Fade, Flex, IconButton, Input, Select, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React, { useState, useMemo, useEffect } from 'react';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import styles from "./page.module.scss";
import { useTransferOwnership } from '@/hooks/mutation/useTransferOwnership';
import Loading from '@/components/loader/loading';
import ConnectButtonWrapper from '@/components/rainbow-kit/connect-button-wrapper';
import { shortenAddress } from '@/lib/helper';
import { useNFTMetadata } from '@/hooks/query/useNFTMetadata';
import { NFTType } from '@/types/graphql/domain-registereds.type';
import { useDomainUpdatedsUser } from '@/hooks/query/graphql/useDomainUpdatedsUser';

const DomainOptionItem = ({ domain, onMetadataLoaded }: { domain: NFTType; onMetadataLoaded: (tokenId: string, name: string) => void }) => {
  const { name, isLoading } = useNFTMetadata(domain.tokenId || "");
  
  useEffect(() => {
    if (!isLoading && name) {
      onMetadataLoaded(domain.tokenId, name);
    }
  }, [name, isLoading, domain.tokenId, onMetadataLoaded]);
  
  return null;
}

export default function Page() {
  const { data: userDomains } = useDomainUpdatedsUser();
  const [selectedDomain, setSelectedDomain] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [domainMetadata, setDomainMetadata] = useState<Record<string, string>>({});

  const { mutation } = useTransferOwnership();

  const handleMetadataLoaded = React.useCallback((tokenId: string, name: string) => {
    setDomainMetadata(prev => ({
      ...prev,
      [tokenId]: name
    }));
  }, []);

  const domainOptions = useMemo(() => {
    if (!userDomains || userDomains.length === 0) {
      return [{
        label: "No domains found",
        value: "",
        description: "You don't have any registered domains yet"
      }];
    }

    return userDomains.map(domain => {
      const name = domainMetadata[domain.tokenId] || domain.name || "Loading...";
      
      return {
        label: name,
        value: name,
        description: `Token ID: ${domain.tokenId ? (domain.tokenId.length > 8 ? `${domain.tokenId.slice(0, 4)}...${domain.tokenId.slice(-4)}` : domain.tokenId) : 'Unknown'} - Owner: ${shortenAddress(domain.owner)}`,
      };
    });
  }, [userDomains, domainMetadata]);

  const handleDomainSelect = (value: string) => {
    setSelectedDomain(value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRecipientAddress(value);
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

    mutation.mutate({
      name: selectedDomain,
      recipient: recipientAddress as HexAddress,
    }, {
      onSuccess: (data) => {
        console.log("Transfer successful:", data);
        alert("Domain transfer initiated successfully!");
      },
      onError: (error) => {
        console.error("Transfer failed:", error);
        alert("Transfer failed. Please try again.");
      },
    });
  };

  return (
    <Column fillWidth paddingTop="80" paddingBottom="8" paddingX="s" horizontal="center" flex={1} className={styles.container}>
      <ScrollToTop>
        <IconButton variant="secondary" icon="chevronUp" />
      </ScrollToTop>

      {userDomains?.map(domain => (
        <DomainOptionItem 
          key={domain.tokenId} 
          domain={domain} 
          onMetadataLoaded={handleMetadataLoaded} 
        />
      ))}

      {mutation.isPending && (
        <Loading />
      )}

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
                options={domainOptions}
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

              <ConnectButtonWrapper>
                <Button
                  onClick={handleTransfer}
                  disabled={!selectedDomain || !recipientAddress}
                  fillWidth
                >
                  Transfer Domain
                </Button>
              </ConnectButtonWrapper>
            </Flex>
          </Flex>
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}