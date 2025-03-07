import { DateField, TagField, Title } from "@refinedev/antd";
import { useShow, useNavigation, useBack } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
} from "antd";
import { useState } from "react";
import { useParams } from "react-router";
import { StatusTag } from "../../caring-task/status-tag";

export const PackagingTaskShow = () => {
  const { taskId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "packaging-tasks",
    id: taskId,
  });

  const [open, setOpen] = useState(true);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data } = queryResult;
  const task = data?.data;

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
  ];
  return (
    <Drawer
      open={open}
      width={breakpoint.sm ? "736px" : "100%"}
      onClose={back}
      title={
        <>
          {task?.status !== "Completed" && (
            <Flex justify="end">
              <Space>
                <Button color="danger" variant="solid">
                  Hủy bỏ
                </Button>
                <Button color="primary" variant="solid">
                  Thay đổi
                </Button>
              </Space>
            </Flex>
          )}
        </>
      }
    >
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          <strong>#{task?.id}</strong> - {task?.task_name}
        </Typography.Title>

        <Divider />
        <Typography.Title level={4}>Kết quả</Typography.Title>
        {task?.status === "Completed" ? (
          <Flex vertical gap={16}>
            {task.images?.length > 0 && (
              <Image.PreviewGroup items={task?.images || []}>
                <Image
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.harvesting_images?.[0]}
                />
              </Image.PreviewGroup>
            )}
            <List
              bordered
              dataSource={[
                {
                  label: "Ngày hoàn thành",
                  value: <DateField value={task?.complete_at} />,
                },
                {
                  label: "Số lượng đóng gói",
                  value: (
                    <Typography.Text>
                      {task?.packaged_quantity} {" " + task?.packaged_unit}
                    </Typography.Text>
                  ),
                },
                {
                  label: "Nội dung",
                  value: <Typography.Paragraph>{task?.result_content}</Typography.Paragraph>,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
                </List.Item>
              )}
            />
          </Flex>
        ) : (
          <Typography.Text type="secondary">Không có kết quả.</Typography.Text>
        )}

        <Divider />
        <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
        <List
          bordered
          dataSource={[
            {
              label: "Ngày bắt đầu",
              value: <DateField value={task?.start_date} />,
            },
            {
              label: "Ngày kết thúc",
              value: <DateField value={task?.end_date} />,
            },
            {
              label: "Trạng thái",
              value: <StatusTag status={task?.status} />,
            },
            { label: "Mức độ ưu tiên", value: task?.priority },
            { label: "ID Nông dân", value: task?.farmer_id },
            { label: "ID Kế hoạch", value: task?.plan_id },
            {
              label: "Mô tả công việc",
              value: <Typography.Paragraph>{task?.description}</Typography.Paragraph>,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />
        <Divider />
        <Typography.Title level={4}>Vật tư</Typography.Title>
        <Table
          pagination={{ pageSize: 5 }}
          bordered
          columns={columns}
          dataSource={task?.items as any[]}
        ></Table>
      </Flex>
    </Drawer>
  );
};
