import React, { useState } from 'react';
import { Badge, Card, Column, Flex, Line, Row, Text } from '@/ui/components';
import { useNFTMetadata } from '@/hooks/query/useNFTMetadata';
import { NFTType } from '@/types/graphql/domain-registereds.type';
import { ContractRentRegistrar } from '@/constans/contracts';
import { useWalletClient } from 'wagmi';
import { formatDate, getTimeRemaining, shortenAddress } from '@/lib/helper';

export default function CardNFT({ nft }: { nft: NFTType }) {
  const { name, image } = useNFTMetadata(nft.tokenId);
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);

  const { data: walletClient } = useWalletClient();

  const addToWallet = async () => {
    try {
      setIsAddingToWallet(true);

      if (!walletClient) {
        alert("Please connect your wallet to use this feature");
        setIsAddingToWallet(false);
        return;
      }

      const tokenAddress = ContractRentRegistrar;
      const tokenId = nft.tokenId;
      const tokenSymbol = "DOMAIN";

      try {
        await walletClient.transport.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC721',
            options: {
              address: tokenAddress,
              tokenId: tokenId,
              symbol: tokenSymbol,
              image: image || "",
            },
          },
        });

      } catch (err) {
        console.warn("ERC721 method not supported");
      }

      console.log("NFT added to wallet successfully");

    } catch (error) {
      console.error("Error adding NFT to wallet:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to add NFT to wallet: " + errorMessage);
    } finally {
      setIsAddingToWallet(false);
    }
  };

  const timeStatus = getTimeRemaining(nft.expires);
  const isExpired = timeStatus === 'Expired';

  return (
    <Card radius="l-4" direction="column" style={{ overflow: 'hidden', maxWidth: '350px' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={image || "/api/placeholder/300/300"}
          alt={nft.name}
          style={{
            borderRadius: "30px",
            width: 'auto',
            maxWidth: '350px',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
        <Badge
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: isExpired ? '#FF5757' : '#2D9CDB',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
          }}
        >
          {timeStatus}
        </Badge>
      </div>

      <Column paddingX="24" paddingY="20" gap="16">
        <Text
          variant="body-default-l"
          style={{
            fontSize: '18px',
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {name}
        </Text>

        <Text size='s' variant="label-default-s" onBackground="neutral-medium" style={{ color: '#5f5f5f' }}>
          Registered on: {formatDate(nft.blockTimestamp)}
        </Text>

        <Text size='s' variant="label-default-s" onBackground="neutral-medium" style={{ color: '#5f5f5f' }}>
          Expired at: {formatDate(nft.expires)}
        </Text>

        <Line />

        <Row fillWidth vertical="center" horizontal="space-between">
          <Column gap="4">
            <Text variant="label-default-s" onBackground="neutral-medium">Token ID</Text>
            <Text variant="body-default-s" style={{ fontWeight: '500' }}>{shortenAddress(nft.tokenId)}</Text>
          </Column>
          <Column gap="4" horizontal="end">
            <Text variant="label-default-s" onBackground="neutral-medium">Owner</Text>
            <Text variant="body-default-s" style={{ fontWeight: '500' }}>{shortenAddress(nft.owner)}</Text>
          </Column>
        </Row>

        <Flex fillWidth horizontal="center" vertical="center" gap="8">
          <div
            onClick={() => {
              if (!isAddingToWallet) {
                addToWallet();
              }
            }}
            style={{
              cursor: isAddingToWallet ? 'not-allowed' : 'pointer',
              padding: '10px 20px',
              backgroundColor: isAddingToWallet ? '#1260cc' : '#1260cc',
              color: 'white',
              borderRadius: '9999px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: isAddingToWallet
                ? 'none'
                : '0 4px 14px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              opacity: isAddingToWallet ? 0.6 : 1,
              pointerEvents: isAddingToWallet ? 'none' : 'auto',
              userSelect: 'none',
            }}
          >
            {
              isAddingToWallet
                ? 'Adding...'
                : 'Add to Wallet'}
          </div>

        </Flex>
      </Column>
    </Card>
  );
}