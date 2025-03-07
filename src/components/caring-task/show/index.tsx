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
import { useNavigate, useParams } from "react-router";
import { CaringTypeTag } from "../type-tag";
import { StatusTag } from "../status-tag";

export const ProductiveTaskShow = () => {
  const { taskId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "caring-tasks",
    id: taskId,
  });
  const navigate = useNavigate();
  const [dataVattu, setDataVattu] = useState<any>([]);
  const [modeVattu, setModeVattu] = useState<"fertilizer" | "pesticide" | "item">("fertilizer");
  const [open, setOpen] = useState(true);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data } = queryResult;
  const task = data?.data;

  const handleModeChange = (mode: "fertilizer" | "pesticide" | "item") => {
    setModeVattu(mode);
    setDataVattu(task ? task["care_" + mode + "s"] : []);
  };

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
                <Button color="primary" variant="solid" onClick={() => navigate("edit")}>
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
                  src={task?.care_images?.[0]}
                />
              </Image.PreviewGroup>
            )}
            <List
              bordered
              dataSource={[
                {
                  label: "Ngày hoàn thành",
                  value: <DateField value={task?.completed_at} />,
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
          <Typography.Text type="secondary">Chưa có kết quả.</Typography.Text>
        )}

        <Divider />
        <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
        <List
          bordered
          dataSource={[
            {
              label: "Loại công việc",
              value: <CaringTypeTag status={task?.status} />,
            },
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
            { label: "Nông dân thực hiện", value: task?.farmer_id },
            { label: "Kế hoạch", value: task?.plan_id },
            {
              label: "Vấn đề liên quan",
              value: task?.problem_id || "Không liên hệ tới vấn đề nào",
            },
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
        <Typography.Title level={4}>Phân bón / Thuốc trừ sâu / Vật tư</Typography.Title>
        <Radio.Group value={modeVattu} onChange={(e) => handleModeChange(e.target.value)}>
          <Radio.Button value="fertilizer">Phân bón</Radio.Button>
          <Radio.Button value="pesticide">Thuốc trừ sâu</Radio.Button>
          <Radio.Button value="item">Vật tư</Radio.Button>
        </Radio.Group>
        <Table
          pagination={{ pageSize: 5 }}
          bordered
          columns={columns}
          dataSource={dataVattu}
        ></Table>
      </Flex>
    </Drawer>
  );
};
