import { useList } from "@refinedev/core";
import { Modal, Table, Tag, Typography, theme, Space } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

type YieldHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  yieldId: number;
};

type YieldHistory = {
  plan_id: number;
  plant_id: number;
  plant_name: string;
  start_date: string;
  end_date: string;
  complete_date: string | null;
  status: "Complete" | "Ongoing";
};

export const YieldHistoryModal = ({ open, onClose, yieldId }: YieldHistoryModalProps) => {
  const { token } = theme.useToken();
  const { data, isLoading } = useList<YieldHistory>({
    resource: `yields/${yieldId}/history-plans`,
    errorNotification: false,
  });

  const columns = [
    {
      title: "Kế hoạch",
      dataIndex: "plan_id",
      key: "plan_id",
      render: (planId: number) => <Text strong>Kế hoạch #{planId}</Text>,
    },
    {
      title: "Cây trồng",
      dataIndex: "plant_name",
      key: "plant_name",
    },
    {
      title: "Thời gian",
      key: "time",
      render: (record: YieldHistory) => (
        <Space direction="vertical" size="small">
          <Text type="secondary">
            <CalendarOutlined /> Bắt đầu: {dayjs(record.start_date).format("DD/MM/YYYY")}
          </Text>
          <Text type="secondary">
            <CalendarOutlined /> Kết thúc: {dayjs(record.end_date).format("DD/MM/YYYY")}
          </Text>
          {record.complete_date && (
            <Text type="secondary">
              <CheckCircleOutlined /> Hoàn thành: {dayjs(record.complete_date).format("DD/MM/YYYY")}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "Complete" ? "success" : "processing"}
          icon={status === "Complete" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status === "Complete" ? "Hoàn thành" : "Đang thực hiện"}
        </Tag>
      ),
    },
  ];

  return (
    <Modal
      title="Lịch sử sử dụng đất"
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
      styles={{
        header: { padding: "16px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` },
        body: { padding: "24px" },
      }}
    >
      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        pagination={false}
        rowKey="plan_id"
      />
    </Modal>
  );
};
