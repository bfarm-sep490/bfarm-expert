import { DateField, TextField } from "@refinedev/antd";
import { useShow, useBack, useOne } from "@refinedev/core";
import { Table, theme, Flex, Grid, Typography, Drawer, Card, Tag, Space, Spin } from "antd";
import { useParams } from "react-router";
import { ProductionStatus } from "./list";
import { IPackagingProduct } from "@/interfaces";

export const PackagingProductShow = () => {
  const { productId } = useParams();
  const { query: queryResult } = useShow<IPackagingProduct>({
    resource: "packaging-products",
    id: productId,
  });
  const back = useBack();
  const { data: taskData, isLoading } = queryResult;
  const task = taskData?.data;
  const { token } = theme.useToken();
  const { data: plantData, isLoading: isPlantLoading } = useOne({
    resource: "plants",
    id: task?.plant_id,
  });
  const plant = plantData?.data;
  const breakpoint = Grid.useBreakpoint();

  const getGradeColor = (grade: string | undefined) => {
    if (!grade) return "default";
    switch (grade) {
      case "Grade 3":
        return "green";
      case "Grade 2":
        return "orange";
      case "Grade 1":
        return "red";
      default:
        return "default";
    }
  };

  const getGradeText = (grade: string | undefined) => {
    if (!grade) return "Chưa đánh giá";
    switch (grade) {
      case "Grade 3":
        return "Loại 3";
      case "Grade 2":
        return "Loại 2";
      case "Grade 1":
        return "Loại 1";
      default:
        return grade;
    }
  };

  if (isLoading) {
    return (
      <Drawer
        open={true}
        onClose={back}
        width={breakpoint.sm ? "60%" : "100%"}
        title="Chi tiết thành phẩm"
      >
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin size="large" />
        </Flex>
      </Drawer>
    );
  }

  return (
    <Drawer
      zIndex={1001}
      open={true}
      width={breakpoint.sm ? "60%" : "100%"}
      onClose={back}
      style={{
        backgroundColor: token.colorBgLayout,
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
      }}
      headerStyle={{
        backgroundColor: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorder}`,
      }}
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Chi tiết thành phẩm
        </Typography.Title>
      }
    >
      <Flex vertical gap={24} style={{ padding: "24px" }}>
        <Card
          title={
            <Flex justify="space-between" align="center">
              <Space direction="vertical" size={4}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {task?.plant_name}
                </Typography.Title>
                <Typography.Text type="secondary">Kế hoạch: {task?.plan_name}</Typography.Text>
              </Space>
              <ProductionStatus status={task?.status || ""} />
            </Flex>
          }
          style={{ width: "100%" }}
        >
          <Flex vertical gap={16}>
            <Flex justify="space-between" align="center">
              <Typography.Text strong>Đánh giá chất lượng</Typography.Text>
              <Tag color={getGradeColor(task?.evaluated_result)}>
                {getGradeText(task?.evaluated_result)}
              </Tag>
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Ngày đóng gói</Typography.Text>
              <DateField format="DD/MM/YYYY HH:mm" value={task?.packaging_date} />
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Ngày hết hạn</Typography.Text>
              {task?.expired_date ? (
                <DateField format="DD/MM/YYYY HH:mm" value={task?.expired_date} />
              ) : (
                <Typography.Text type="secondary">Chưa cập nhật</Typography.Text>
              )}
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Số lượng thành phẩm</Typography.Text>
              <Space>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {task?.available_packs}
                </Typography.Text>
                <Typography.Text type="secondary">/ {task?.total_packs} gói</Typography.Text>
              </Space>
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Sản lượng mỗi gói</Typography.Text>
              <Typography.Text strong style={{ fontSize: 16 }}>
                {task?.quantity_per_pack} kg
              </Typography.Text>
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Số lượng đã nhận</Typography.Text>
              <Typography.Text strong style={{ fontSize: 16 }}>
                {task?.received_pack_quantity} gói
              </Typography.Text>
            </Flex>
          </Flex>
        </Card>

        {task?.retailer_name && (
          <Card title="Thông tin đơn hàng" style={{ width: "100%" }}>
            <Flex vertical gap={8}>
              <Flex justify="space-between">
                <Typography.Text strong>Mã đơn hàng</Typography.Text>
                <Typography.Text>{task?.order_id}</Typography.Text>
              </Flex>
              <Flex justify="space-between">
                <Typography.Text strong>Nhà bán lẻ</Typography.Text>
                <Typography.Text>{task?.retailer_name}</Typography.Text>
              </Flex>
            </Flex>
          </Card>
        )}
      </Flex>
    </Drawer>
  );
};
