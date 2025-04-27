import React from 'react';
import {
  Badge,
  Button,
  Column,
  Dialog,
  Flex,
  Row,
  Text
} from '@/ui/components';

export default function DialogUseDomain({
  isOpen,
  handleClose,
  domainName,
  imageURI,
  onConfirm
}: {
  isOpen: boolean;
  handleClose: () => void;
  domainName: string;
  imageURI: string;
  onConfirm?: () => void;
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    // Redirect to manage page after confirming
    window.location.href = '/manage';
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Use Domain"
      description={`Do you want to use ${domainName || 'domain'}.pharos as your active domain?`}
      footer={
        <Row horizontal="space-between" gap="12" fillWidth>
          <Button
            variant="danger"
            label="Cancel"
            onClick={handleClose}
          />
          <Button
            variant="primary"
            label="Use This Domain"
            style={{
              cursor: 'pointer',
              position: 'relative',
              zIndex: 11
            }}
            onClick={handleConfirm}
          />
        </Row>
      }
      base
    >
      <Column gap="24" fillWidth>
        <Flex direction="column" gap="16" horizontal="center">
          <Row width={100} position='relative' style={{ maxWidth: '320px' }}>
            <img
              src={imageURI}
              alt="Domain NFT"
              style={{
                width: '100%',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
            />
          </Row>
        </Flex>
        <Column gap="16" padding="24" background="neutral-weak" radius="l">
          <Row horizontal="space-between" vertical="center" fillWidth>
            <Text variant="body-default-m" onBackground="neutral-medium">Domain Name</Text>
            <Text variant="body-default-m">{domainName}.pharos</Text>
          </Row>
          <Row horizontal="space-between" vertical="center" fillWidth>
            <Text variant="body-default-m" onBackground="neutral-medium">Action</Text>
            <Badge color="info">Set as Active Domain</Badge>
          </Row>
        </Column>
      </Column>
    </Dialog>
  );
}