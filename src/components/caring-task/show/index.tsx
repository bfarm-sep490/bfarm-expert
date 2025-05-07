import { DateField, TagField, TextField, Title, useForm, useModalForm } from "@refinedev/antd";
import {
  useShow,
  useNavigation,
  useBack,
  useList,
  useOne,
  useUpdate,
  useGetIdentity,
} from "@refinedev/core";
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
  Modal,
  Tag,
  Select,
  notification,
  Input,
  Form,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CaringTypeTag } from "../type-tag";
import { StatusTag } from "../status-tag";
import { set, values } from "lodash";
import { IIdentity } from "@/interfaces";

type HistoryAssignedModalProps = {
  visible: boolean;
  onClose: () => void;
  data: any;
};

export const AssignedTaskStatus = ({ status }: { status: string }) => {
  return (
    <Tag color={status === "Active" ? "blue" : "red"}>
      {status === "Active" ? "Thực hiện" : "Không thể thực hiện"}
    </Tag>
  );
};

export const HistoryAssignedModal = ({ visible, onClose, data }: HistoryAssignedModalProps) => {
  const columns = [
    { title: "ID", dataIndex: "farmer_id", key: "farmer_id" },
    { title: "Tên", dataIndex: "farmer_name", key: "farmer_name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: any) => <AssignedTaskStatus status={value} />,
    },
    {
      title: "Hết hạn",
      dataIndex: "expire_at",
      key: "expire_at",
      render: (value: any) =>
        value ? <DateField format="hh:mm DD/MM/YYYY" value={value} /> : "Chưa hết hạn",
    },
    {
      title: "Ngày giao việc",
      dataIndex: "create_at",
      key: "create_at",
      render: (value: any) => <DateField format="hh:mm DD/MM/YYYY" value={value} />,
    },
  ];
  return (
    <Modal
      title={"Lịch sử giao việc"}
      visible={visible}
      onCancel={onClose}
      onClose={onClose}
      width={1000}
      closable={true}
      footer={null}
    >
      <Table
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data.sort((a: any, b: any) => (a.status !== "Active" ? 1 : -1))}
        pagination={{ pageSize: 5 }}
      ></Table>
    </Modal>
  );
};

interface ChangeAssignedTasksModalProps {
  historyAssignedFarmers?: [];
  visible: boolean;
  onClose: () => void;
  assignedFarmers: any;
  start_date?: Date;
  end_date?: Date;
  type?: string;
  taskId?: number;
  refetch?: () => void;
  chosenFarmers?: [];
}

export const ChangeAssignedTasksModal: React.FC<ChangeAssignedTasksModalProps> = ({
  historyAssignedFarmers,
  visible,
  onClose,
  assignedFarmers,
  start_date,
  end_date,
  type,
  taskId,
  chosenFarmers,
  refetch,
}) => {
  console.log("historyAssignedFarmers", historyAssignedFarmers);
  const [newFarmer, setNewFarmer] = useState<any>(null);
  const [reason, setReason] = useState<string>("");
  const { id } = useParams();
  const { formProps, saveButtonProps } = useForm({
    resource:
      type === "caring-tasks"
        ? `caring-tasks/${taskId}/farmers/${newFarmer?.id}`
        : type === "harvesting-tasks"
          ? `harvesting-tasks/${taskId}/farmers/${newFarmer?.id}`
          : `packaging-tasks/${taskId}/farmers/${newFarmer?.id}`,
    action: "create",
    createMutationOptions: {
      onSuccess: (data) => {
        if (data?.data !== null && typeof data?.data !== "string") {
          notification.error({
            message: data?.data as unknown as string,
          });
          return;
        }
        notification.success({
          message: "Thay đổi người làm thành công",
        });
        refetch?.();
        setNewFarmer(null);
        setReason("");
        onClose();
      },
    },
  });
  const { data: freeFarmersData, isLoading } = useList<{
    id: string;
    name: string;
  }>({
    resource: `plans/${id}/busy-farmers`,
    errorNotification: false,
    filters: [
      {
        field: "start",
        operator: "eq",
        value: start_date,
      },
      {
        field: "end",
        operator: "eq",
        value: end_date,
      },
    ],
    queryOptions: {
      enabled: visible,
    },
  });
  const freeFarmers =
    chosenFarmers
      ?.filter((x: any) => !freeFarmersData?.data?.some((y) => y.id === x?.id))
      ?.filter((x: any) => !historyAssignedFarmers?.some((y: any) => y?.farmer_id === x?.id)) || [];
  useEffect(() => {
    if (!visible) {
      setNewFarmer(null);
      setReason("");
    }
  }, [visible]);
  useEffect(() => {
    formProps?.form?.setFieldValue("reason", reason);
  }, [reason]);

  return (
    <Modal
      title="Thay đổi người làm"
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      footer={
        <>
          <Flex justify="end" gap={8}>
            <Button onClick={onClose}>Hủy</Button>
            <Button {...saveButtonProps} disabled={!newFarmer} type="primary">
              Thay đổi
            </Button>
          </Flex>
        </>
      }
      width={600}
    >
      <Typography.Text style={{ fontSize: 12, color: "red", fontStyle: "italic" }}>
        * Bạn có thể thay đổi người làm cho công việc này. Vui lòng chọn những người đang rảnh việc
        dưới đây.
      </Typography.Text>
      <Form
        form={formProps.form}
        layout="vertical"
        onFinish={formProps.onFinish}
        onChange={formProps.onChange}
      >
        <div>
          {assignedFarmers && (
            <Form.Item
              name="reason"
              label="Lý do thay đổi"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginTop: 20 }}
              rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
            >
              <Input.TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lí do"
                rows={4}
              />
            </Form.Item>
          )}
          <Form.Item
            name="new_assigned_farmer_id"
            vertical={true}
            label="Chọn người làm mới"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[{ required: true, message: "Vui lòng chọn người làm mới!" }]}
          >
            <Select
              style={{ width: "100%", marginBottom: 16 }}
              placeholder="Select a new farmer"
              value={newFarmer?.id}
              onChange={(value) => {
                setNewFarmer(
                  freeFarmers.find((farmer: { id: string; name: string }) => farmer.id === value) ||
                    null,
                );
              }}
            >
              {isLoading && <Select.Option value={undefined}>Loading...</Select.Option>}
              {freeFarmers.map((farmer: any) => (
                <Select.Option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangeAssignedTasksModal;
type ProductiveTaskShowProps = {
  taskId?: number;
  onClose?: () => void;
  visible?: boolean;
  refetch?: () => void;
};
