import { Column, Flex, Row, Text } from '@/ui/components';
import React, { useState, useMemo } from 'react';
import styles from "./page.module.scss";
import { normalize } from '@/lib/bignumber';
import { pharosNativeToken, tokensDecimals } from '@/constans/config';
import { DomainUpdatedsCurType } from '@/types/graphql/domain-updated.type';
import { ETHTransferToPNSsCurType } from '@/types/graphql/eth-transfer-to-pns.type';

export default function TabHistory({
  domains = [],
  transfers = []
}: {
  domains: DomainUpdatedsCurType[];
  transfers: ETHTransferToPNSsCurType[];
}) {
  console.log("transferData", domains)
  console.log("pnsData", transfers)

  const [typeFilter, setTypeFilter] = useState('transfer');
  const [dateFilter, setDateFilter] = useState('30');

  function blockTimestampToDate(unixTimestamp: string) {
    const date = new Date(Number(unixTimestamp) * 1000);
    return date.toLocaleDateString();
  }

  function isWithinDateRange(timestamp: string, days: string) {
    if (days === 'all') return true;
    const now = new Date();
    const transactionDate = new Date(Number(timestamp) * 1000);
    const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= Number(days);
  }

  const filteredTransferData = useMemo(() => {
    return transfers
      .filter(tx => isWithinDateRange(tx.blockTimestamp, dateFilter))
      .sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)); // Sort by date, newest first
  }, [transfers, dateFilter]);

  const filteredPNSData = useMemo(() => {
    return domains
      .filter(tx => isWithinDateRange(tx.blockTimestamp, dateFilter))
      .sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)); // Sort by date, newest first
  }, [domains, dateFilter]);

  const isEmpty = typeFilter === 'transfer'
    ? filteredTransferData.length === 0
    : filteredPNSData.length === 0;

  return (
    <Column className={styles.historyTab}>
      <Row className={styles.transactionFilters}>
        <select
          className={styles.typeFilter}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="transfer">Transfer</option>
          <option value="create-pns">Create PNS</option>
        </select>
        <select
          className={styles.dateFilter}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="30">Last 30 Days</option>
          <option value="90">Last 3 Months</option>
          <option value="365">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </Row>

      {typeFilter === 'transfer' ? (
        <Column className={styles.transactionTable}>
          <Row className={styles.tableHeader}>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Type</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Amount</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>To</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Date</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Points</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Status</Text>
          </Row>

          {filteredTransferData.map(transaction => (
            <Row key={transaction.id} className={styles.tableRow}>
              <Flex className={styles.tableCell}>
                <Text className={`${styles.transactionType} ${styles.transfer}`}>
                  Transfer
                </Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text className={styles.transactionAmount} variant='label-default-s'>
                  {normalize(transaction.amount, tokensDecimals)} {pharosNativeToken}
                </Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text variant='label-default-s'>{transaction.name}</Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text variant='label-default-s'>{blockTimestampToDate(transaction.blockTimestamp)}</Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text className={styles.pointsAmount} variant='label-default-s'>
                  +5 pts
                </Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text className={`${styles.statusBadge} ${styles.completed}`}>
                  Completed
                </Text>
              </Flex>
            </Row>
          ))}
        </Column>
      ) : (
        <Column className={styles.transactionTable}>
          <Row className={styles.tableHeader}>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Type</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Name</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Date</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Expires</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Points</Text>
            <Text className={styles.tableHeaderCell} variant='label-default-s'>Status</Text>
          </Row>

          {filteredPNSData.map(transaction => (
            <Row key={transaction.id} className={styles.tableRow}>
              <Flex className={styles.tableCell}>
                <Text className={`${styles.transactionType} ${styles["create-pns"]}`}>
                  Create PNS
                </Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text variant='label-default-s'>{transaction.name}</Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text variant='label-default-s'>{blockTimestampToDate(transaction.blockTimestamp)}</Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text variant='label-default-s'>{transaction.expires ? blockTimestampToDate(transaction.expires) : 'N/A'}</Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text className={styles.pointsAmount} variant='label-default-s'>
                  +20 pts
                </Text>
              </Flex>
              <Flex className={styles.tableCell}>
                <Text className={`${styles.statusBadge} ${styles.completed}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase()}
                </Text>
              </Flex>
            </Row>
          ))}
        </Column>
      )}

      {/* Empty State */}
      {isEmpty && (
        <Column className={styles.emptyState}>
          <Flex className={styles.emptyIcon}>📋</Flex>
          <Text color="neutral-alpha-strong">No {typeFilter === 'transfer' ? 'transfer' : 'PNS'} history yet</Text>
        </Column>
      )}
    </Column>
  );
}