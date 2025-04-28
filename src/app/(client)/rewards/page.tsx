"use client"
import { Button, Column, Fade, Flex, IconButton, Row, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React, { useState, useEffect } from 'react';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./page.module.scss";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'rewards');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabName: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tabName);
    router.push(`?${params.toString()}`, { scroll: false });
    setActiveTab(tabName);
  };

  const mockTransactions = [
    { id: 1, type: 'Earned', amount: 200, date: '2025-04-20', status: 'completed' },
    { id: 2, type: 'Redeemed', amount: 50, date: '2025-04-15', status: 'completed' },
    { id: 3, type: 'Earned', amount: 75, date: '2025-04-10', status: 'pending' },
  ];

  return (
    <Column fillWidth paddingTop="80" paddingBottom="8" paddingX="s" horizontal="center" flex={1} className={styles.container}>
      <ScrollToTop>
        <IconButton variant="secondary" icon="chevronUp" className={styles.scrollTopButton} />
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
        className={styles.mainCard}
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
          
          <Row className={styles.pageHeader}>
            <Text variant="heading-default-l" className={styles.pageTitle}>
              Your Rewards
            </Text>
            <Column className={styles.totalPoints}>
              <Text className={styles.pointsValue}>1,250</Text>
              <Text className={styles.pointsLabel}>Total Points</Text>
            </Column>
          </Row>

          <Row className={styles.tabContainer}>
            <Button 
              className={`${styles.tabButton} ${activeTab === 'rewards' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('rewards')}
              variant='tertiary'
            >
              My Rewards
            </Button>
            <Button 
              className={`${styles.tabButton} ${activeTab === 'leaderboard' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('leaderboard')}
              variant='tertiary'
            >
              Leaderboard
            </Button>
            <Button 
              className={`${styles.tabButton} ${activeTab === 'history' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('history')}
              variant='tertiary'
            >
              History
            </Button>
          </Row>

          {isLoading ? (
            <Row className={styles.loadingState}>
              <Flex className={styles.loadingSpinner}></Flex>
              <Text color="neutral-alpha-strong">Loading your rewards...</Text>
            </Row>
          ) : (
            <Flex className={styles.tabContent}>
              {activeTab === 'rewards' && (
                <Column className={styles.rewardsTab}>
                  <Row className={styles.cardsContainer}>
                    <Column className={styles.rewardCard}>
                      <Flex className={styles.cardIcon}>🎁</Flex>
                      <Text variant="heading-default-s" className={styles.cardTitle}>Available Rewards</Text>
                      <Text color="neutral-alpha-strong" className={styles.cardDesc}>
                        Redeem your points for exclusive benefits
                      </Text>
                      <Button className={styles.cardButton} style={{ width: "100%" }}>Browse Rewards</Button>
                    </Column>
                    
                    <Column className={styles.rewardCard}>
                      <Flex className={styles.cardIcon}>🏆</Flex>
                      <Text variant="heading-default-s" className={styles.cardTitle}>Your Ranking</Text>
                      <Text color="neutral-alpha-strong" className={styles.cardDesc}>
                        Currently ranked #42 of 156 members
                      </Text>
                      <Button 
                        className={styles.cardButton} 
                        style={{ width: "100%" }}
                        onClick={() => handleTabChange('leaderboard')}
                      >
                        View Leaderboard
                      </Button>
                    </Column>
                  </Row>
                  
                  <Column className={styles.earnMoreSection}>
                    <Text variant="heading-default-s" className={styles.sectionTitle}>Earn More Points</Text>
                    <Column className={styles.activityList}>
                      <Row className={styles.activityItem}>
                        <Column className={styles.activityInfo}>
                          <Text className={styles.activityName}>Daily check-in</Text>
                          <Text className={styles.activityPoints}>+10 points</Text>
                        </Column>
                        <Button className={styles.activityButton} variant='tertiary'>Claim</Button>
                      </Row>
                      <Row className={styles.activityItem}>
                        <Column className={styles.activityInfo}>
                          <Text className={styles.activityName}>Transfer with PNS</Text>
                          <Text className={styles.activityPoints}>+5 points</Text>
                        </Column>
                        <Button className={styles.activityButton} variant='tertiary' onClick={() => window.location.href = "/transfers"}>Go</Button>
                      </Row>
                      <Row className={styles.activityItem}>
                        <Column className={styles.activityInfo}>
                          <Text className={styles.activityName}>Create PNS</Text>
                          <Text className={styles.activityPoints}>+20 points</Text>
                        </Column>
                        <Button className={styles.activityButton} variant='tertiary' onClick={() => window.location.href = "/home"}>Go</Button>
                      </Row>
                    </Column>
                  </Column>
                </Column>
              )}
              
              {activeTab === 'leaderboard' && (
                <Column className={styles.leaderboardTab}>
                  <Row className={styles.leaderboardHeader}>
                    <Text className={styles.leaderboardTitle}>Top Members</Text>
                    <select className={styles.periodSelector}>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>All Time</option>
                    </select>
                  </Row>
                  
                  <Column className={styles.leaderboardList}>
                    <Row className={`${styles.leaderboardItem} ${styles.topRanked}`}>
                      <Text className={styles.leaderRank}>1</Text>
                      <Flex className={styles.leaderAvatar}>👑</Flex>
                      <Column className={styles.leaderInfo}>
                        <Text className={styles.leaderName}>John Doe</Text>
                        <Text className={styles.leaderPoints}>3,540 pts</Text>
                      </Column>
                    </Row>
                    <Row className={styles.leaderboardItem}>
                      <Text className={styles.leaderRank}>2</Text>
                      <Flex className={styles.leaderAvatar}>🥈</Flex>
                      <Column className={styles.leaderInfo}>
                        <Text className={styles.leaderName}>Jane Smith</Text>
                        <Text className={styles.leaderPoints}>3,120 pts</Text>
                      </Column>
                    </Row>
                    <Row className={styles.leaderboardItem}>
                      <Text className={styles.leaderRank}>3</Text>
                      <Flex className={styles.leaderAvatar}>🥉</Flex>
                      <Column className={styles.leaderInfo}>
                        <Text className={styles.leaderName}>Robert Johnson</Text>
                        <Text className={styles.leaderPoints}>2,980 pts</Text>
                      </Column>
                    </Row>
                    <Row className={styles.leaderboardItem}>
                      <Text className={styles.leaderRank}>4</Text>
                      <Flex className={styles.leaderAvatar}>👤</Flex>
                      <Column className={styles.leaderInfo}>
                        <Text className={styles.leaderName}>Emily Davis</Text>
                        <Text className={styles.leaderPoints}>2,450 pts</Text>
                      </Column>
                    </Row>
                    <Row className={styles.leaderboardItem}>
                      <Text className={styles.leaderRank}>5</Text>
                      <Flex className={styles.leaderAvatar}>👤</Flex>
                      <Column className={styles.leaderInfo}>
                        <Text className={styles.leaderName}>Michael Wilson</Text>
                        <Text className={styles.leaderPoints}>2,210 pts</Text>
                      </Column>
                    </Row>
                    
                    <Row className={`${styles.leaderboardItem} ${styles.yourRank}`}>
                      <Text className={styles.leaderRank}>42</Text>
                      <Flex className={styles.leaderAvatar}>👤</Flex>
                      <Column className={styles.leaderInfo}>
                        <Text className={styles.leaderName}>You</Text>
                        <Text className={styles.leaderPoints}>1,250 pts</Text>
                      </Column>
                    </Row>
                  </Column>
                </Column>
              )}
              
              {activeTab === 'history' && (
                <Column className={styles.historyTab}>
                  <Row className={styles.transactionFilters}>
                    <select className={styles.typeFilter}>
                      <option>All Types</option>
                      <option>Earned</option>
                      <option>Redeemed</option>
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
                            {transaction.type}
                          </Text>
                        </Flex>
                        <Flex className={styles.tableCell}>
                          <Text className={styles.pointsAmount}>
                            {transaction.type === 'Earned' ? '+' : '-'}{transaction.amount} pts
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
              )}
            </Flex>
          )}
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}