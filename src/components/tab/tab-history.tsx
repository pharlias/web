import { Column, Flex, Row, Text } from '@/ui/components';
import React from 'react';
import styles from "./page.module.scss";

export default function TabHistory() {
  const mockTransactions = [
    { id: 1, type: 'Transfer', amount: 200, date: '2025-04-20', status: 'completed' },
    { id: 2, type: 'Create-PNS', amount: 50, date: '2025-04-15', status: 'completed' },
    { id: 3, type: 'Transfer', amount: 75, date: '2025-04-10', status: 'pending' },
  ];

  const formatType = (type: string) => {
    return type.replace(/-/g, ' ');
  };

  return (
    <Column className={styles.historyTab}>
      <Row className={styles.transactionFilters}>
        <select className={styles.typeFilter}>
          <option>All Types</option>
          <option>Transfer</option>
          <option>Create PNS</option>
        </select>
        <select className={styles.dateFilter}>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Last Year</option>
        </select>
      </Row>

      <Column className={styles.transactionTable}>
        <Row className={styles.tableHeader}>
          <Text className={styles.tableHeaderCell}>Type</Text>
          <Text className={styles.tableHeaderCell}>Amount</Text>
          <Text className={styles.tableHeaderCell}>Date</Text>
          <Text className={styles.tableHeaderCell}>Status</Text>
        </Row>

        {mockTransactions.map(transaction => (
          <Row key={transaction.id} className={styles.tableRow}>
            <Flex className={styles.tableCell}>
              <Text className={`${styles.transactionType} ${styles[transaction.type.toLowerCase()]}`}>
                {formatType(transaction.type)}
              </Text>
            </Flex>
            <Flex className={styles.tableCell}>
              <Text className={styles.pointsAmount}>
                +{transaction.amount} pts
              </Text>
            </Flex>
            <Flex className={styles.tableCell}>
              <Text>{transaction.date}</Text>
            </Flex>
            <Flex className={styles.tableCell}>
              <Text className={`${styles.statusBadge} ${styles[transaction.status]}`}>
                {transaction.status}
              </Text>
            </Flex>
          </Row>
        ))}
      </Column>

      {mockTransactions.length === 0 && (
        <Column className={styles.emptyState}>
          <Flex className={styles.emptyIcon}>📋</Flex>
          <Text color="neutral-alpha-strong">No transaction history yet</Text>
        </Column>
      )}
    </Column>
  )
}
