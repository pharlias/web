import React from 'react';
import {
  Badge,
  Button,
  Column,
  Dialog,
  Row,
  Text
} from '@/ui/components';
import { pharosExplorer } from '@/constans/config';

export default function DialogSuccess({
  isOpen,
  handleClose,
  txHash,
  message
}: {
  isOpen: boolean;
  handleClose: () => void;
  txHash: HexAddress;
  message: string;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Registration Successful"
      description={`${message || 'no description'}`}
      footer={
        <Row horizontal="space-between" gap="12" fillWidth>
          <Button
            variant="danger"
            label="Close"
            onClick={handleClose}
          />
          <Button
            variant="primary"
            label={"Manage Domain"}
            style={{
              cursor: 'pointer',
              position: 'relative', 
              zIndex: 11 
            }}
            onClick={() => window.location.href = '/manage'}
          />
        </Row>
      }
      // zIndex={10}
      base
    >
      <Column gap="24" fillWidth>
        <Column gap="16" padding="24" background="neutral-weak" radius="l">
          <Row horizontal="space-between" vertical="center" fillWidth>
            <Text variant="body-default-m" onBackground="neutral-medium">Expires</Text>
            <Text variant="body-strong-m">
              {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </Text>
          </Row>

          <Row horizontal="space-between" vertical="center" fillWidth>
            <Text variant="body-default-m" onBackground="neutral-medium">Transaction</Text>
            <Row gap="4" vertical="center">
              <Button
                onClick={() => window.open(`${pharosExplorer}/tx/${txHash}`, '_blank')}
                variant='secondary'
              >
                View on Explorer
              </Button>
            </Row>
          </Row>

          <Row horizontal="space-between" vertical="center" fillWidth>
            <Text variant="body-default-m" onBackground="neutral-medium">Status</Text>
            <Badge color="success">Confirmed</Badge>
          </Row>
        </Column>
      </Column>
    </Dialog>
  );
}