import React, { useEffect, useState } from 'react';
import { Badge, Card, Column, Flex, Line, Row, Text } from '@/ui/components';
import { useNFTMetadata } from '@/hooks/query/useNFTMetadata';
import { NFTType } from '@/types/graphql/domain-registereds.type';
import { formatDate, getTimeRemaining, shortenAddress } from '@/lib/helper';
import DialogUseDomain from '@/components/dialog/dialog-use-domain';

export default function CardNFT({ nft }: { nft: NFTType }) {
  const { name, image } = useNFTMetadata(nft.tokenId);
  const [isUsingNFT, setIsUsingNFT] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const usedDomain = localStorage.getItem('usedDomain');
    if (usedDomain) {
      const parsedDomain = JSON.parse(usedDomain);
      if (parsedDomain.tokenId === nft.tokenId) {
        setIsUsingNFT(true);
      }
    }
  }, [nft.tokenId]);

  const handleUseDomain = async () => {
    if (isUsingNFT) {
      localStorage.removeItem('usedDomain');
      setIsUsingNFT(false);
    } else {
      setIsDialogOpen(true);
    }
  };

  const confirmUseDomain = () => {
    localStorage.setItem('usedDomain', JSON.stringify(nft));
    setIsUsingNFT(true);
    setIsDialogOpen(false);
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
            onClick={handleUseDomain}
            style={{
              cursor: 'pointer',
              padding: '10px 20px',
              backgroundColor: isUsingNFT ? '#ef4444' : '#22c55e',
              color: 'white',
              borderRadius: '9999px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              userSelect: 'none',
              width: '100%',
            }}
          >
            {isUsingNFT ? 'Unused PNS' : 'Use PNS'}
          </div>

          <DialogUseDomain
            isOpen={isDialogOpen}
            domainName={name || 'Unknown Domain'}
            handleClose={() => setIsDialogOpen(false)}
            imageURI={image || "/api/placeholder/300/300"}
            onConfirm={confirmUseDomain}
          />
        </Flex>
      </Column>
    </Card>
  );
}