import React, { useEffect, useState } from 'react';
import { Badge, Card, Column, Flex, Line, Row, Text } from '@/ui/components';
import { useNFTMetadata } from '@/hooks/query/useNFTMetadata';
import { NFTType } from '@/types/graphql/domain-registereds.type';
import { ContractRentRegistrar } from '@/constans/contracts';
import { useAccount, useWalletClient } from 'wagmi';

export default function CardNFT({ nft }: { nft: NFTType }) {
  const { data: metadataUrl } = useNFTMetadata(nft.tokenId);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);
  const [isInWallet, setIsInWallet] = useState(false);

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const ipfsToGateway = (ipfsUri: string) => {
    const cid = ipfsUri.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cid}`;
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!metadataUrl || typeof metadataUrl !== 'string') return;
      try {
        const metadataRes = await fetch(ipfsToGateway(metadataUrl));
        const metadataJson = await metadataRes.json();
        if (metadataJson.image) {
          setImageUrl(ipfsToGateway(metadataJson.image));
        }
      } catch (error) {
        console.error('Failed to fetch IPFS metadata:', error);
      }
    };
    fetchImage();
  }, [metadataUrl]);

  useEffect(() => {
    if (address && nft.owner.toLowerCase() === address.toLowerCase()) {
      setIsInWallet(true);
    } else {
      setIsInWallet(false);
    }
  }, [address, nft.owner]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTimeRemaining = () => {
    const now = Date.now();
    const expiry = parseInt(nft.expires) * 1000;
    const timeLeft = expiry - now;
    if (timeLeft <= 0) return 'Expired';
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    return days > 30 ? `${Math.floor(days / 30)} months left` : `${days} days left`;
  };

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

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
      const tokenSymbol = "NFT";

      try {
        await walletClient.transport.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC721',
            options: {
              address: tokenAddress,
              tokenId: tokenId,
              symbol: tokenSymbol,
              image: imageUrl || "",
            },
          },
        });

        setIsInWallet(true);

      } catch (err) {
        console.warn("ERC721 method not supported, trying ERC20 fallback");
        await walletClient.transport.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: 0,
              image: imageUrl || "",
            },
          },
        });

        setIsInWallet(true);
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

  const timeStatus = getTimeRemaining();
  const isExpired = timeStatus === 'Expired';

  return (
    <Card radius="l-4" direction="column" style={{ overflow: 'hidden', maxWidth: '350px' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={imageUrl || "/api/placeholder/300/300"}
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
          {nft.name}
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
              if (!isAddingToWallet && !isInWallet) {
                addToWallet();
              }
            }}
            style={{
              cursor: isAddingToWallet || isInWallet ? 'not-allowed' : 'pointer',
              padding: '10px 20px',
              backgroundColor: isInWallet ? '#1260cc' : '#1260cc',
              color: 'white',
              borderRadius: '9999px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: isAddingToWallet || isInWallet
                ? 'none'
                : '0 4px 14px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              opacity: isAddingToWallet || isInWallet ? 0.6 : 1,
              pointerEvents: isAddingToWallet || isInWallet ? 'none' : 'auto',
              userSelect: 'none',
            }}
            onMouseOver={(e) => {
              if (!isAddingToWallet && !isInWallet) {
                e.currentTarget.style.backgroundColor = '#e04848'; // slightly darker red on hover
              }
            }}
            onMouseOut={(e) => {
              if (!isAddingToWallet && !isInWallet) {
                e.currentTarget.style.backgroundColor = '#FF5757'; // revert to original
              }
            }}
          >
            {isInWallet
              ? 'Added to Wallet'
              : isAddingToWallet
                ? 'Adding...'
                : 'Add to Wallet'}
          </div>

        </Flex>
      </Column>
    </Card>
  );
}