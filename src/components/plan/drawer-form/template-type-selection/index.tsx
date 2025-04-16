import { Modal, Space, Card, Typography } from "antd";
import { FileTextOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useOrderStore } from "@/store/order-store";
import { TemplateType } from "../hooks/useFormList";

const { Text } = Typography;

interface TemplateTypeSelectionProps {
  open: boolean;
  onClose: () => void;
  onTemplateTypeSelect: (type: TemplateType) => void;
}

export const TemplateTypeSelection: React.FC<TemplateTypeSelectionProps> = ({
  open,
  onClose,
  onTemplateTypeSelect,
}) => {
  const { clearOrders } = useOrderStore();

  return (
    <Modal
      title="Chọn phương thức tạo kế hoạch"
      open={open}
      onCancel={() => {
        clearOrders();
        onClose();
      }}
      footer={null}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card
          hoverable
          style={{
            width: "100%",
            cursor: "pointer",
            borderColor: "#d9d9d9",
          }}
          onClick={() => onTemplateTypeSelect("with-template")}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <FileTextOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <Text strong>Sử dụng template</Text>
            </Space>
            <Text type="secondary">
              Tạo kế hoạch từ template có sẵn. Bạn cần nhập thông tin cơ bản để lấy template phù
              hợp.
            </Text>
          </Space>
        </Card>

        <Card
          hoverable
          style={{
            width: "100%",
            cursor: "pointer",
            borderColor: "#d9d9d9",
          }}
          onClick={() => onTemplateTypeSelect("without-template")}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <InfoCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <Text strong>Tạo mới</Text>
            </Space>
            <Text type="secondary">Tạo kế hoạch mới từ đầu, không sử dụng template</Text>
          </Space>
        </Card>
      </Space>
    </Modal>
  );
};
