"use client"

import React, { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { Button, Flex, Row, Text } from '@/ui/components';
import { useDomainUsed } from '@/hooks/query/useDomainUsed';

const clearSiteData = () => {
  try {
    localStorage.clear();
    
    sessionStorage.clear();
    
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  } catch (error) {
    console.error("Error clearing site data:", error);
  }
};

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
  const { name } = useDomainUsed();
  
  const [previouslyConnected, setPreviouslyConnected] = React.useState(false);

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
            
        useEffect(() => {
          if (previouslyConnected && !connected && ready) {
            clearSiteData();
            console.log('Wallet disconnected, site data cleared');
          }
          
          if (connected !== previouslyConnected) {
            setPreviouslyConnected(!!connected);
          }
        }, [connected, ready]);
        
        useEffect(() => {
          if (ready && !connected) {
            clearSiteData();
            console.log('Initial state: not connected, site data cleared');
          }
        }, [ready]);

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
                        {name ? `${name}.pharos` : account.displayName}
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