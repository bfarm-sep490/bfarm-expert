import {
  FieldTimeOutlined,
  GoldOutlined,
  GroupOutlined,
  SnippetsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { DateField, TextField } from "@refinedev/antd";
import { Card, Col, Flex, FormProps, Row, Space, Table, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import { CaringTypeTag } from "../../../components/caring-task/type-tag";

type Props = {
  plants: any;
  yields: any;
  formProps: FormProps;
  experts: any;
  productiveTasks: any;
  harvestingTasks: any;
  inspectingTasks: any;
  inspectors: any;
  farmers: any;
  packagingTasks: any;
};

export const VerifyPlanInformation = ({
  plants,
  yields,
  formProps,
  experts,
  productiveTasks,
  harvestingTasks,
  inspectingTasks,
  inspectors,
  farmers,
  packagingTasks,
}: Props) => {
  const column_productive_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Loại chăm sóc",
      dataIndex: "type",
      key: "type",
      render: (text: any, record: any) => <CaringTypeTag status={record?.task_type} />,
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            farmers?.find((farmer: any) => farmer.id === record.farmer_id)?.name || "Chưa xác định"
          }
        />
      ),
    },
  ];
  const column_packaging_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },

    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            farmers?.find((farmer: any) => farmer.id === record.farmer_id)?.name || "Chưa xác định"
          }
        />
      ),
    },
  ];
  const column_harvesting_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            farmers?.find((farmer: any) => farmer.id === record.farmer_id)?.name || "Chưa xác định"
          }
        />
      ),
    },
  ];
  const column_inspecting_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Nhà kiểm định",
      dataIndex: "inspector_id",
      key: "inspector_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            inspectors?.find((inspector: any) => inspector.id === record.inspector_id)?.name ||
            "Chưa xác định"
          }
        />
      ),
    },
  ];
  return (
    <Flex vertical justify="center" about="center" gap={10}>
      <Card title={"Xác nhận thông tin chung kế hoạch"}>
        <Typography.Title level={4}></Typography.Title>

        <Row gutter={[16, 16]}>
          <Col>
            <Flex vertical gap={16} style={{ flex: 1 }}>
              <Space align="start" style={{ marginTop: 12 }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Cây trồng:</Typography.Text>

                <Typography.Text>
                  {plants?.find(
                    (plant: any) => plant.id === formProps?.form?.getFieldValue("plant_id"),
                  )?.plant_name || "Không có dữ liệu"}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <GoldOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Khu đất:</Typography.Text>
                <Typography.Text>
                  {yields?.find(
                    (yieldItem: any) => yieldItem.id === formProps?.form?.getFieldValue("yield_id"),
                  )?.yield_name || "Không có dữ liệu"}
                </Typography.Text>
              </Space>
              <Space align="start" style={{ marginTop: 12 }}>
                <FieldTimeOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Thời gian dự kiến</Typography.Text>
                <Typography.Text>
                  <DateField
                    value={dayjs(formProps?.form?.getFieldValue("start_date"))}
                    format="DD/MM/YYYY"
                  ></DateField>{" "}
                  -{" "}
                  <DateField
                    value={dayjs(formProps?.form?.getFieldValue("end_date"))}
                    format="DD/MM/YYYY"
                  ></DateField>
                </Typography.Text>
              </Space>
              <Space align="start" style={{ marginTop: 12 }}>
                <GroupOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Sản lượng dự kiến:</Typography.Text>
                <Typography.Text>
                  {formProps?.form?.getFieldValue("estimated_product")}{" "}
                  {formProps?.form?.getFieldValue("estimated_unit")}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <FieldTimeOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Chuyên gia:</Typography.Text>
                <Typography.Text>
                  {experts?.find(
                    (expert: any) => expert.id === formProps.form?.getFieldValue("expert_id"),
                  )?.name || "Không có dữ liệu"}
                </Typography.Text>
              </Space>
            </Flex>
          </Col>
          <Col>
            <Space align="start" style={{ marginTop: 12 }}>
              <SnippetsOutlined style={{ fontSize: 16 }} />
              <Typography.Text strong>Mô tả</Typography.Text>
              <Typography.Paragraph style={{ maxWidth: 200 }}>
                {formProps.form?.getFieldValue("description")}
              </Typography.Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card title={"Xác nhận công việc đã phân công của kế hoạch"} style={{ minHeight: "600px" }}>
        <Tabs defaultActiveKey={"1"} tabPosition={"left"} style={{ minHeight: 220 }}>
          <Tabs.TabPane key="1" tab="Chăm sóc">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_productive_checked}
              dataSource={productiveTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="Thu hoạch">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_harvesting_checked}
              dataSource={harvestingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="Kiểm định">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_inspecting_checked}
              dataSource={inspectingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab="Thu hoạch">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_packaging_checked}
              dataSource={packagingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Flex>
  );
};
