import {
  Divider,
  Flex,
  Modal,
  QRCode,
  Typography,
  Avatar,
  List,
  Skeleton,
  Button,
  Spin,
  notification,
  Grid,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { useCreate, useList } from "@refinedev/core";

type QRCodeModalProps = {
  orders: any[];
  address: string;
  visible: boolean;
  onClose: () => void;
};

export const QRCodeModal = (props: QRCodeModalProps) => {
  const breakpoint = Grid.useBreakpoint();
  const { address, visible, onClose, orders } = props;
  const [loading, setLoading] = useState(false);
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);

  const { data: retailersData, isLoading: retailerLoading } = useList({
    resource: "retailers",
    queryOptions: {
      enabled: visible,
    },
  });

  const [api, contextHolder] = notification.useNotification();

  const { mutate } = useCreate({
    mutationOptions: {
      onSuccess(data, variables, context) {
        setProcessingEmail(null);

        if (data?.data === null || typeof data?.data === "string") {
          api.success({
            message: "Gửi QR Code thành công",
            description: "QR Code đã được gửi thành công.",
          });
        } else {
          api.error({
            message: "Gửi QR Code không thành công",
            description: "Vui lòng thử lại sau.",
          });
        }

        setLoading(false);
      },
      onError() {
        setProcessingEmail(null);
        api.error({
          message: "Gửi QR Code không thành công",
          description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
        setLoading(false);
      },
    },
  });

  const handleShare = (email: string) => {
    setLoading(true);
    setProcessingEmail(email);

    mutate({
      resource: "orders",
      values: {
        retailer_email: email,
        qrcode: address || "",
      },
    });
  };

  const filteredRetailers =
    retailersData?.data?.filter((retailer: any) =>
      orders?.some((order: any) => retailer?.id === order?.retailer_id),
    ) || [];

  const isSmallScreen = !breakpoint?.sm && !breakpoint?.md;

  return (
    <Modal
      title={<Typography.Title level={4}>QR Code</Typography.Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={isSmallScreen ? "100%" : 700}
      destroyOnClose
    >
      {contextHolder}
      <Flex align="flex-start" gap="large" vertical={isSmallScreen}>
        <Flex
          vertical
          align="center"
          style={isSmallScreen ? { width: "100%", marginBottom: 16 } : undefined}
        >
          <QRCode
            size={isSmallScreen ? 200 : 250}
            value={`https://bfarmx.space/qr/${address || ""}`}
            bordered
            errorLevel="H"
          />
          <Typography.Text
            copyable={{ text: `https://bfarmx.space/qr/${address || ""}` }}
            style={{ marginTop: 16 }}
          >
            {address ? `${address.substring(0, 8)}...${address.substring(address.length - 8)}` : ""}
          </Typography.Text>
        </Flex>

        {!isSmallScreen && <Divider type="vertical" style={{ height: "100%" }} />}

        <Flex
          vertical
          style={{
            flex: 1,
            height: isSmallScreen ? 300 : 360,
            overflow: "auto",
            width: isSmallScreen ? "100%" : undefined,
          }}
          id="scrollableDiv"
        >
          <Typography.Title level={5}>Gửi QR Code</Typography.Title>

          {retailerLoading ? (
            <Flex justify="center" align="center" style={{ height: isSmallScreen ? 240 : 300 }}>
              <Spin size="large" />
            </Flex>
          ) : (
            <InfiniteScroll
              dataLength={filteredRetailers.length}
              next={() => {}}
              hasMore={false}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={
                filteredRetailers.length === 0 ? (
                  <Divider plain>Không có nhà bán lẻ nào</Divider>
                ) : (
                  <Divider plain>Đã hiển thị tất cả 🤐</Divider>
                )
              }
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={filteredRetailers}
                renderItem={(item: any) => (
                  <List.Item
                    key={item?.id}
                    actions={[
                      <Button
                        loading={loading && processingEmail === item.email}
                        disabled={loading && processingEmail !== item.email}
                        type="primary"
                        size="small"
                        onClick={() => handleShare(item.email)}
                      >
                        Gửi
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src={item?.avatar_image} size="large" alt={item?.name || ""} />
                      }
                      title={<Typography.Text strong>{item.name}</Typography.Text>}
                      description={item.email}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: "Không có dữ liệu" }}
              />
            </InfiniteScroll>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};
