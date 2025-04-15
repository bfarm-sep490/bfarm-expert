import { DateField, TagField, TextField } from "@refinedev/antd";
import { useShow, useBack, useOne } from "@refinedev/core";
import { Table, theme, Flex, Grid, Typography, List, Divider, Drawer, Card } from "antd";
import { useParams } from "react-router";
import { ProductionStatus } from "./list";

export const PackagingProductShow = () => {
  const { productId } = useParams();
  const { query: queryResult } = useShow<any>({
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
  const orders = task?.orders || [];
  const columns = [
    {
      title: "Id",
      dataIndex: "order_id",
      key: "order_id",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Tên chủ đơn hàng",
      dataIndex: "retailer_name",
      key: "retailer_name",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Số lượng thành phẩm",
      dataIndex: "quantity_of_packs",
      key: "quantity_of_packs",
      render: (text: string) => <TextField value={text} />,
    },
  ];

  return (
    <Drawer
      zIndex={1001}
      loading={isLoading}
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
      }}
      title={<TextField style={{ padding: "16px" }} value={"Chi tiết thành phẩm"} />}
    >
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Card
          title={
            <>
              <Flex justify="space-between" align="center">
                <Flex vertical={false} gap={6}>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Thành Phẩm {task?.quantity_per_pack} {" kg "}
                    {task?.plant_name?.toLowerCase()}
                  </Typography.Title>
                  <Typography.Text
                    style={{
                      fontSize: 14,
                      color: `${
                        task?.evaluated_result === "Grade 3"
                          ? "green"
                          : task?.evaluated_result === "Grade 2"
                            ? "orange"
                            : "red"
                      }`,
                    }}
                  >
                    {task?.evaluated_result === "Grade 3"
                      ? "Loại 3"
                      : task?.evaluated_result === "Grade 2"
                        ? "Loại 2"
                        : task?.evaluated_result === "Grade 1"
                          ? "Loại 1"
                          : task?.evaluated_result}
                  </Typography.Text>
                </Flex>
                <ProductionStatus status={task?.status} />
              </Flex>
            </>
          }
          style={{ width: "100%" }}
        >
          <Flex vertical gap={12}>
            <Flex justify="space-between">
              <Typography.Text strong>Kế hoạch </Typography.Text>
              <Typography.Text>
                {task?.plan_name ? task?.plan_name : "Chưa thu hoạch"}
              </Typography.Text>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Ngày đóng gói</Typography.Text>
              <DateField format="hh:mm DD/MM/YYYY" value={task?.packaging_date} />
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Ngày hết hạn</Typography.Text>
              <DateField format="hh:mm DD/MM/YYYY" value={task?.expired_date} />
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Số lượng thành phẩm</Typography.Text>
              <Typography.Text>
                <Typography.Text style={{ fontSize: 18 }} strong>
                  {task?.pack_quantity + "/"}
                </Typography.Text>
                {task?.total_packs + " gói"}
              </Typography.Text>{" "}
            </Flex>
            <Flex justify="space-between">
              <Typography.Text strong>Sản lượng trong thành phẩm</Typography.Text>
              <Typography.Text>
                <Typography.Text style={{ fontSize: 18 }} strong>
                  {task?.quantity_per_pack + " kg/"}
                </Typography.Text>
                {"thành phẩm"}
              </Typography.Text>
            </Flex>
          </Flex>
        </Card>

        <Card title="Danh sách đơn hàng" style={{ width: "100%" }}>
          <Table pagination={false} bordered columns={columns} dataSource={orders} />
        </Card>
      </Flex>
    </Drawer>
  );
};
