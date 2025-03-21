import { DateField, TagField, TextField, Title } from "@refinedev/antd";
import { useShow, useNavigation, useBack, useList } from "@refinedev/core";
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
import { useNavigate, useParams } from "react-router";
import { StatusTag } from "../../caring-task/status-tag";
import ChangeAssignedTasksModal, {
  HistoryAssignedModal,
} from "@/components/caring-task/show";

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
  const task = data?.data?.[0];
  const { data: historyAssignedData } = useList({
    resource: `packaging-tasks/${taskId}/assigned-farmers`,
  });
  const [assignedModal, setAssignedModal] = useState(false);
  const { data: chosenFarmersData } = useList({
    resource: `plans/${task?.plan_id}/farmers`,
  });
  const chosenFarmers = chosenFarmersData?.data || [];
  const [visible, setVisible] = useState(false);
  const historyAssignedFarmers = historyAssignedData?.data || [];
  const columns = [
    { title: "ID", dataIndex: "item_id", key: "id" },
    { title: "Tên", dataIndex: "item_name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
  ];
  const navigate = useNavigate();
  return (
    <Drawer
      open={open}
      width={breakpoint.sm ? "736px" : "100%"}
      onClose={back}
      title={
        <>
          {task?.status === "Ongoing" && (
            <Flex justify="end">
              <Space>
                <Button color="danger" variant="solid">
                  Hủy bỏ
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
        {task?.status === "Complete" ? (
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
                  value: (
                    <DateField
                      format={"hh:mm DD/MM/YYYY"}
                      value={task?.complete_date}
                    />
                  ),
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
                  value: (
                    <Typography.Paragraph>
                      {task?.result_content}
                    </Typography.Paragraph>
                  ),
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text strong>{item.label}:</Typography.Text>{" "}
                  {item.value}
                </List.Item>
              )}
            />
          </Flex>
        ) : (
          <Typography.Text type="secondary">Không có kết quả.</Typography.Text>
        )}

        <Divider />
        <Flex justify="space-between" align="center">
          <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
          {(task?.status === "Ongoing" || task?.status === "Draft") && (
            <Button
              color="primary"
              variant="solid"
              onClick={() => navigate("edit")}
            >
              Thay đổi
            </Button>
          )}
        </Flex>
        <List
          bordered
          dataSource={[
            {
              label: "Ngày bắt đầu",
              value: (
                <DateField
                  format={"hh:mm DD/MM/YYYY"}
                  value={task?.start_date}
                />
              ),
            },
            {
              label: "Ngày kết thúc",
              value: (
                <DateField format={"hh:mm DD/MM/YYYY"} value={task?.end_date} />
              ),
            },
            {
              label: "Trạng thái",
              value: <StatusTag status={task?.status} />,
            },
            {
              label: "Nông dân thực hiện",
              value: task?.farmer_information?.[0]?.farmer_name,
            },
            { label: "Kế hoạch", value: task?.plan_name },
            {
              label: "Mô tả công việc",
              value: (
                <Typography.Paragraph>{task?.description}</Typography.Paragraph>
              ),
            },
            {
              label: "Ngày tạo",
              value: (
                <DateField
                  format={"hh:mm DD/MM/YYYY"}
                  value={task?.created_at}
                />
              ),
            },
            {
              label: "Câp nhật lần cuối",
              value: task?.updated_at ? (
                <DateField
                  format={"hh:mm DD/MM/YYYY"}
                  value={task?.updated_at}
                />
              ) : (
                "Chưa cập nhập lần nào"
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text>{" "}
              {item.value}
            </List.Item>
          )}
        />
        <List
          bordered
          dataSource={[
            {
              label: "Ngày tạo",
              value: (
                <DateField
                  format={"hh:mm DD/MM/YYYY"}
                  value={task?.created_at}
                />
              ),
            },
            {
              label: "Người tạo",
              value: <TextField value={task?.created_by} />,
            },
            {
              label: "Câp nhật lần cuối",
              value: task?.updated_at ? (
                <DateField
                  format={"hh:mm DD/MM/YYYY"}
                  value={task?.updated_at}
                />
              ) : (
                "Chưa cập nhập lần nào"
              ),
            },
            {
              label: "Người cập nhập cuối",
              value: <TextField value={task?.updated_by} />,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text>{" "}
              {item.value}
            </List.Item>
          )}
        />
        <Divider />
        <Flex justify="space-between" gap={5}>
          <Typography.Title level={4}>Người thực hiện</Typography.Title>
          <Space>
            {" "}
            <Button type="dashed" onClick={() => setVisible(true)}>
              Lịch sử giao việc
            </Button>
          </Space>
        </Flex>
        <List
          bordered
          dataSource={[
            {
              label: "Id",
              value: (
                <TextField
                  value={
                    task?.farmer_information?.[0]?.farmer_id || "Chưa giao việc"
                  }
                />
              ),
            },
            {
              label: "Tên nông dân",
              value: (
                <TextField
                  value={
                    task?.farmer_information?.[0]?.name || "Chưa giao việc"
                  }
                />
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.label}:</Typography.Text>{" "}
              {item.value}
            </List.Item>
          )}
        />
        <Divider />
        <Typography.Title level={4}>Vật tư</Typography.Title>
        <Table
          pagination={{ pageSize: 5 }}
          bordered
          columns={columns}
          dataSource={task?.packaging_items as any[]}
        ></Table>
      </Flex>
      <HistoryAssignedModal
        visible={visible}
        onClose={() => setVisible(false)}
        data={historyAssignedFarmers}
      />
    </Drawer>
  );
};
