import { TextField } from "@refinedev/antd";
import { Card, Flex, Typography, Image, Empty, theme } from "antd";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
type Props = {
  orderData: any;
  plantData: any;
  loading?: boolean;
  style?: React.CSSProperties;
};
export const DashboardTopPlants = ({ orderData, plantData, loading, style }: Props) => {
  const topPlantsData = useMemo(() => {
    const plantOrderCounts: { [key: string]: number } = {};

    orderData?.data?.forEach((order: any) => {
      const plantId = order.plant_id;
      if (plantId) {
        plantOrderCounts[plantId] = (plantOrderCounts[plantId] || 0) + 1;
      }
    });

    return (
      plantData?.data
        ?.map((plant: any) => ({
          ...plant,
          number_order: plantOrderCounts[plant.id] || 0,
        }))
        .sort((a: any, b: any) => b.number_order - a.number_order) || []
    );
  }, [orderData, plantData]);
  const { token } = theme.useToken();
  return (
    <Card style={style} title="Top giống cây trồng" loading={loading}>
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: "auto",
        }}
      >
        <InfiniteScroll
          dataLength={topPlantsData.length}
          next={() => {}}
          hasMore={false}
          loader={<Typography.Text type="secondary">Đang tải...</Typography.Text>}
          scrollableTarget="scrollableDiv"
        >
          {topPlantsData.length > 0 ? (
            topPlantsData.slice(0, 5).map((plant: any) => (
              <Flex
                key={plant.id}
                gap={12}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: token?.colorBgLayout,
                  marginBottom: 16,
                }}
              >
                {plant.image_url && (
                  <Image
                    width={100}
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "1px solid #f0f0f0",
                    }}
                    src={plant.image_url}
                    alt={plant.plant_name}
                  />
                )}
                <Flex vertical gap={12}>
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {plant.plant_name}
                  </Typography.Title>

                  <Flex gap={4} align="center">
                    <Typography.Text strong>Số đơn hàng:</Typography.Text>
                    <TextField value={plant.number_order || 0} />
                  </Flex>
                </Flex>
              </Flex>
            ))
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </InfiniteScroll>
      </div>
    </Card>
  );
};
