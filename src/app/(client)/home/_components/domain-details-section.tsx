import { useState } from "react";
import { Badge, Card, Column, Flex, IconButton, Row, Skeleton, Text } from "@/ui/components";
import { PNS } from "@/types/pns.type";
import { useGenerateImage } from "@/hooks/mutation/useGenerateImage";
import { useRegisterPNS } from "@/hooks/mutation/useRegisterPNS";
import DialogGeneratedPNS from "@/components/dialog/dialog-generated-pns";
import Loading from "@/components/loader/loading";
import { pharosNativeToken } from "@/constans/config";

interface DomainDetailsSectionProps {
  domain: PNS;
  onReset: () => void;
}

export const DomainDetailsSection = ({ domain, onReset }: DomainDetailsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutation, result } = useGenerateImage();
  const { mutation: registerMutation, txHash } = useRegisterPNS();

  const handleGenerateImage = () => {
    mutation.mutate({ name: domain.name }, {
      onSuccess: (data) => {
        console.log("Image generated successfully", data);
      },
      onError: (error) => {
        console.error("Error generating image", error);
      }
    });
  };

  useState(() => {
    handleGenerateImage();
  });

  const handleRegisterDomain = () => {
    registerMutation.mutate({ name: domain.name }, {
      onSuccess: (data) => {
        console.log("PNS created successfully", data);
        setIsDialogOpen(true);
      },
      onError: (error) => {
        console.error("Error creating PNS", error);
      }
    });
  };

  return (
    <Row fitWidth horizontal="start">
      {registerMutation.isPending && (
        <Loading />
      )}
      <DialogGeneratedPNS
        isOpen={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        domainName={domain.name}
        txHash={txHash as HexAddress}
        imageURI={`data:image/svg+xml;utf8,${encodeURIComponent(result)}`}
      />

      <Card maxWidth={23} radius="l-4" direction="column">
        {result ? (
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(result)}`}
            alt="Domain SVG"
            style={{
              borderRadius: "30px",
            }}
          />
        ) : (
          <Skeleton
            shape="line"
            fillWidth
            style={{
              height: "220px",
              minWidth: "320px",
              borderRadius: "30px",
            }}
          />
        )}

        <Column fillWidth paddingX="20" paddingY="24" gap="12">
          <Text variant="body-default-l">
            {domain.name}.pharos
          </Text>

          <Text
            onBackground="neutral-weak"
            variant="body-default-s"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              whiteSpace: 'normal',
            }}
          >
            This is a dynamic identity for {domain.name}.pharos.
          </Text>

          <Row gap="s" marginTop="8">
            {domain.available ? (
              <Column fillWidth gap="8">
                <Row fillWidth gap="s" vertical="center" horizontal="stretch">
                  <Row
                    onClick={onReset}
                    fillWidth
                    style={{
                      cursor: "pointer",
                      justifyContent: "center",
                      padding: "10px 0",
                      borderRadius: "20px",
                      border: "1px solid #ff0000",
                      transition: "background-color 0.3s",
                    }}
                  >
                    Back
                  </Row>
                  <Badge
                    fillWidth
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      justifyContent: "center",
                      opacity: registerMutation.isPending ? 0.7 : 1
                    }}
                    onClick={!registerMutation.isPending ? handleRegisterDomain : undefined}
                  >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                  </Badge>
                </Row>
              </Column>
            ) : (
              <Flex
                direction="column"
                radius="m"
                padding="s"
                flex={1}
                border="danger-strong"
                horizontal="center"
              >
                <Text>
                  Taken
                </Text>
              </Flex>
            )}
          </Row>
        </Column>

        <Row paddingX="20" paddingY="12" gap="2" vertical="center">
          <Row gap="8" vertical="center" horizontal="space-between" fillWidth>
            <Row vertical="center" gap="4">
              <IconButton
                icon="money"
                size="s"
                variant="ghost"
              />
              <Text variant="label-default-s" onBackground="neutral-medium">
                {domain.price} {pharosNativeToken}
              </Text>
            </Row>
            <Row vertical="center" gap="4">
              <IconButton
                icon="clock"
                size="s"
                variant="ghost"
              />
              <Text variant="label-default-s" onBackground="neutral-medium">
                {domain.duration}
              </Text>
            </Row>
          </Row>
        </Row>
      </Card>
    </Row>
  );
};