"use client"

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/ui/components';

export default function ConnectButtonWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
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
                    fillWidth
                  >
                    Connect Wallet
                  </Button>
                );
              }
              return (
                <React.Fragment>
                  {children}
                </React.Fragment>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
