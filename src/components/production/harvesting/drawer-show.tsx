import { DateField, TagField, TextField } from "@refinedev/antd";
import { useShow, useBack, useOne, useList } from "@refinedev/core";
import { Table, theme, Flex, Grid, Typography, List, Divider, Drawer, Card } from "antd";
import { initial } from "lodash";
import { useParams } from "react-router";
import { ProductionStatus } from "../packaging/list";

export const HarvestingProductShow = () => {
  const { productId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "harvesting-product",
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
  const { data: packagingProductData, isLoading: isPackagingProductLoading } = useList({
    resource: "packaging-products",
    filters: [
      {
        field: "harvesting_task_id",
        operator: "eq",
        value: productId,
      },
    ],
  });
  const packagingProducts = packagingProductData?.data || [];
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Số lượng thành phẩm",
      dataIndex: "retailer_name",
      key: "retailer_name",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Sản lượng trong thành phẩm",
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
                    Sản lượng {" " + task?.plant_name?.toLowerCase()}
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
              <DateField format="hh:mm DD/MM/YYYY" value={task?.harvesting_date} />
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Ngày hết hạn</Typography.Text>
              <DateField format="hh:mm DD/MM/YYYY" value={task?.expired_date} />
            </Flex>

            <Flex justify="space-between">
              <Typography.Text strong>Sản lượng</Typography.Text>
              <Typography.Text>
                <Typography.Text style={{ fontSize: 18 }} strong>
                  {task?.available_harvesting_quantity}
                </Typography.Text>
                {"/" + task?.harvesting_quantity + " " + task?.harvesting_unit}
              </Typography.Text>{" "}
            </Flex>
          </Flex>
        </Card>

        <Card title="Danh sách thành phẩm" style={{ width: "100%" }}>
          <Table pagination={false} bordered columns={columns} dataSource={packagingProducts} />
        </Card>
      </Flex>
    </Drawer>
  );
};
