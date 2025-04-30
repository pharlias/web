"use client"
import { Button, Column, Fade, Flex, IconButton, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React, { useState, useEffect, useRef } from 'react';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import styles from "./page.module.scss";
import ConnectButtonWrapper from '@/components/rainbow-kit/connect-button-wrapper';
import { pharosNativeToken } from '@/constans/config';
import { useAccountBalance } from '@/hooks/query/useAccountBalance';
import { useTransferETHToPNS } from '@/hooks/mutation/useTransferETHToPNS';
import { useDomainUpdateds } from '@/hooks/query/graphql/useDomainUpdateds';
import { DomainUpdatedsCurType } from '@/types/graphql/domain-updated.type';

export default function Page() {
  const [amount, setAmount] = useState("");
  const [pnsInput, setPnsInput] = useState("");
  const [filteredNameServices, setFilteredNameServices] = useState<DomainUpdatedsCurType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { bNormalized } = useAccountBalance({});
  const { mutation } = useTransferETHToPNS();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useDomainUpdateds()

  useEffect(() => {
    if (pnsInput.trim() === '') {
      setFilteredNameServices([]);
      return;
    }

    if (!data || data.length === 0) {
      setFilteredNameServices([]);
      return;
    }

    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(pnsInput.toLowerCase())
    );
    setFilteredNameServices(filtered);
    setIsDropdownOpen(filtered.length > 0);
  }, [pnsInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || regex.test(value)) {
      setAmount(value);
    }
  };

  const handlePnsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPnsInput(event.target.value);
    setIsDropdownOpen(true);
  };

  const handleNameServiceSelect = (name: string) => {
    setPnsInput(name);
    setIsDropdownOpen(false);
  };

  const handleTransfer = () => {
    if (!amount || !pnsInput) {
      alert("Please enter both amount and recipient PNS.");
      return;
    }

    mutation.mutate({
      name: pnsInput,
      amount: amount,
    }, {
      onSuccess: (data) => {
        console.log("Transfer successful:", data);
        alert("Transfer successful!");
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
            Transfer your {pharosNativeToken} here!
          </Text>

          <Flex
            horizontal="center"
            fillWidth
          >
            <Flex
              direction="column"
              gap="24"
              fillWidth
              horizontal="center"
              style={{
                maxWidth: "400px",
                width: "100%",
              }}
            >

              <Flex className={styles.formGroup} direction="column" gap="16">
                <Column>
                  <label htmlFor="input-amount">Amount</label>
                  <div className={styles.amountInputWrapper}>
                    <input
                      type="text"
                      id="input-amount"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className={styles.input}
                    />
                    <span className={styles.currencyLabel}>{pharosNativeToken}</span>
                  </div>
                  <Text style={{ marginTop: "4px", fontSize: "12px", color: "#A0AEC0" }}>
                    Balance: {bNormalized} {pharosNativeToken}
                  </Text>
                </Column>

                <Column>
                  <label htmlFor="input-pns">Recipient PNS</label>
                  <div className={styles.pnsInputWrapper} ref={dropdownRef}>
                    <input
                      type="text"
                      id="input-pns"
                      placeholder="Enter pns"
                      value={pnsInput}
                      onChange={handlePnsChange}
                      className={styles.input}
                    />
                    <span className={styles.currencyLabel}>.pharos</span>
                    {isDropdownOpen && filteredNameServices.length > 0 && (
                      <div className={styles.dropdown}>
                        {filteredNameServices.map((item: DomainUpdatedsCurType) => (
                          <div
                            key={item.id}
                            className={styles.dropdownItem}
                            onClick={() => handleNameServiceSelect(item.name)}
                          >
                            <span className={styles.nameServiceName}>{item.name}</span>
                            <span className={styles.nameServiceOwner}>{item.owner.substring(0, 6)}...{item.owner.substring(38)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Column>

                <ConnectButtonWrapper>
                  <Button
                    onClick={handleTransfer}
                    className={styles.transferButton}
                    fillWidth
                  >
                    Transfer ${pharosNativeToken}
                  </Button>
                </ConnectButtonWrapper>
              </Flex>
            </Flex>
          </Flex>
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}