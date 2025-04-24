"use client"

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { Button, Flex, Row, Text } from '@/ui/components';

const ChainIcon = ({ iconUrl, name, background, size = 20 }: {
  iconUrl?: string;
  name?: string;
  background?: string;
  size?: number;
}) => (
  <Flex
    style={{
      background,
      width: size,
      height: size,
      borderRadius: 999,
      overflow: 'hidden',
      marginRight: 4,
    }}
    vertical='center'
    horizontal='center'
    align='center'
  >
    {iconUrl && (
      <Image
        alt={`${name ?? 'Chain'} icon`}
        src={iconUrl}
        style={{ width: size, height: size }}
        width={size}
        height={size}
      />
    )}
  </Flex>
);

export default function WalletButtonCustom() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    justifyContent='center'
                    variant="secondary"
                    type="button"
                    style={{
                      minHeight: 20,
                      height: 35
                    }}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    justifyContent='center'
                    variant="secondary"
                    type="button"
                    style={{
                      minHeight: 20,
                      height: 35
                    }}
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <Flex vertical='center' horizontal='center'>
                  <Row gap='4' vertical='center' zIndex={8}>
                    <Button
                      onClick={openChainModal}
                      justifyContent='center'
                      variant="tertiary"
                      type="button"
                      style={{
                        minHeight: 20,
                        height: 35,
                        paddingLeft: "3px",
                        paddingRight: "0",
                        widows: 30,
                        border: "1px solid #E6E8EC",
                      }}
                    >
                      {chain.hasIcon && (
                        <Flex vertical='center' horizontal='center' paddingX='0'>
                          <ChainIcon
                            iconUrl={chain.iconUrl}
                            name={chain.name}
                            background={chain.iconBackground} />
                        </Flex>
                      )}
                      {/* <Flex vertical='center' horizontal='center'>
                        <Text
                          style={{
                            fontSize: 13,
                            lineHeight: '16px',
                            fontWeight: 500,
                            marginLeft: "5px"
                          }}
                        >
                          {chain.name}
                        </Text>
                      </Flex> */}
                    </Button>

                    <Button
                      onClick={openAccountModal}
                      type="button"
                      variant='tertiary'
                      justifyContent='center'
                      style={{
                        minHeight: 20,
                        height: 35,
                        border: "1px solid #E6E8EC",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          lineHeight: '16px',
                          fontWeight: 500
                        }}
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Text>
                    </Button>
                  </Row>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
