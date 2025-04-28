"use client"
import { Button, Column, Fade, Flex, IconButton, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React, { useState, useEffect, useRef } from 'react';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import styles from "./page.module.scss";
// import Loading from '@/components/loader/loading';
import ConnectButtonWrapper from '@/components/rainbow-kit/connect-button-wrapper';
import { pharosNativeToken } from '@/constans/config';
import { useAccountBalance } from '@/hooks/query/useAccountBalance';

const listNameService = [
  {
    "blockNumber": 24999438,
    "blockTimestamp": 1745767164,
    "expires": 1777303164,
    "id": "e61099b2ad959ee95dfda0431b5e9359f18aafc5655635b86766e52b59eb71d2",
    "name": "akbarkarbu",
    "owner": "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
    "tokenId": "11042402670429195402652322962130643585105215340262615376066753061456405062362",
    "transactionHash": "0xd9d3bacd455ce5c814c2d9a90da0014081754cd5bf8d3f8c3e9924589d48b6c1"
  },
  {
    "blockNumber": 24999300,
    "blockTimestamp": 1745766888,
    "expires": 1777302888,
    "id": "aadf81554af8dd1b12398fe1430322e888a50607207e5c8d2083c0000fa495e0",
    "name": "fajar",
    "owner": "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
    "tokenId": "29270649576026935457520342402169056026320720217515482806726273981520883851229",
    "transactionHash": "0x169078c9171ca4bf27942b8847075b14cfb8c3c30513e5636356cc2978a06083"
  },
  {
    "blockNumber": 24978133,
    "blockTimestamp": 1745724554,
    "expires": 1777260554,
    "id": "9094dc94c85d45a21043ee21c7ff1684d186dfddf21edc5c2dd801fd1fb30830",
    "name": "p",
    "owner": "0x2b0C849c8a263cC6e680F40fbCa8Cb75f8bCe81A",
    "tokenId": "15839622151235328338992417200276513453392043559189476109745974925571748283563",
    "transactionHash": "0x652afd5191c7fbcd38247315060f463c51fa43ef78e1068b7248bf59841ff27f"
  }
];

export default function Page() {
  const [amount, setAmount] = useState("");
  const [pnsInput, setPnsInput] = useState("");
  const [filteredNameServices, setFilteredNameServices] = useState<typeof listNameService>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { bNormalized } = useAccountBalance({}) 

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pnsInput.trim() === '') {
      setFilteredNameServices([]);
      return;
    }

    const filtered = listNameService.filter(item =>
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

    console.log("Transferring", amount, pharosNativeToken, "to", pnsInput);
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
                        {filteredNameServices.map((item) => (
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