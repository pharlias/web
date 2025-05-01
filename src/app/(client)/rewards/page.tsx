"use client"
import { Badge, Button, Column, Fade, Flex, Icon, IconButton, Row, Text } from '@/ui/components';
import { ScrollToTop } from '@/ui/components/ScrollToTop';
import React, { useState, useEffect, Suspense } from 'react';
import { PageFooter } from '@/components/layout/footer';
import { PageBackground } from '@/components/layout/background';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./page.module.scss";
import TabHistory from '@/components/tab/tab-history';
import Loading from '@/components/loader/loading';
import { useDomainUpdatedsUser } from '@/hooks/query/graphql/useDomainUpdatedsUser';
import { useETHTransferToPNSUser } from '@/hooks/query/graphql/useETHTransferToPNSUser';

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'rewards');

  const [points, setPoints] = useState(0);

  const { data: domains } = useDomainUpdatedsUser();
  const { data: transfers } = useETHTransferToPNSUser();

  useEffect(() => {
    if (domains.length > 0 || transfers.length > 0) {
      setPoints((domains?.length || 0) * 20 + (transfers?.length || 0) * 5);
    }
  }, [domains, transfers]);

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
              <Text className={styles.pointsValue}>{String(points || "0")}</Text>
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
                      <Flex className={styles.cardIcon}>
                        <Icon name='trophy' />
                      </Flex>
                      <Text variant="heading-default-s" className={styles.cardTitle}>Your Ranking</Text>
                      <Text color="neutral-alpha-strong" className={styles.cardDesc}>
                        Coming soon...
                      </Text>
                      <Button
                        className={styles.cardButton}
                        style={{ width: "100%" }}
                        onClick={() => handleTabChange('leaderboard')}
                      >
                        View Leaderboard
                      </Button>
                    </Column>

                    <Column className={styles.rewardCard}>
                      <Flex className={styles.cardIcon}>
                        <Icon name='clock' />
                      </Flex>
                      <Text variant="heading-default-s" className={styles.cardTitle}>History Transactions</Text>
                      <Text color="neutral-alpha-strong" className={styles.cardDesc}>
                        View your transaction history and points earned
                      </Text>
                      <Button
                        className={styles.cardButton}
                        style={{ width: "100%" }}
                        onClick={() => handleTabChange('history')}
                      >
                        View History
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
                        <Button className={styles.activityButton} variant='tertiary'>Coming Soon</Button>
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
                <>
                  <div style={{
                    zIndex: 5,
                    backdropFilter: "blur(2px)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%)",
                    borderRadius: "20px",
                  }}>
                    <Badge style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                      arrow={false}
                    >
                      Coming Soon
                    </Badge>
                  </div>
                  <Column className={styles.leaderboardTab} style={{
                    padding: "10px",
                  }}>
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
                </>
              )}

              {activeTab === 'history' && (
                <TabHistory domains={domains} trnsfers={transfers} />
              )}
            </Flex>
          )}
        </Column>
        <PageFooter />
      </Column>
    </Column>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}