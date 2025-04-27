"use client"
import { Column, Fade, Flex, Grid, IconButton, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React from 'react';
import CardNFT from './_components/CardNFT';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import styles from "./page.module.scss";
import ConnectButtonWrapper from '@/components/rainbow-kit/connect-button-wrapper';
import { useDomainUpdateds } from '@/hooks/query/graphql/useDomainUpdateds';

export default function Page() {
  const { data } = useDomainUpdateds();
  
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
            Manage your Pharos Name Service Here
          </Text>
          <Flex horizontal='center' fillWidth>
            <ConnectButtonWrapper>
              {data && Array.isArray(data) && data.length > 0 ? (
                <Grid gap="s" fillWidth fillHeight columns={3} tabletColumns={2} mobileColumns={1} align='center'>
                  {data.map((nft) => (
                    <CardNFT nft={nft} key={nft.id} />
                  ))}
                </Grid>
              ) : (
                <Flex 
                  horizontal='center' 
                  vertical='center' 
                  fillWidth
                >
                  <Text variant="body-default-m" onBackground="neutral-weak">No domain found</Text>
                </Flex>
              )}
            </ConnectButtonWrapper>
          </Flex>
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}