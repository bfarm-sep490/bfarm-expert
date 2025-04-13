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
  visible: boolean;
  onClose: () => void;
  assignedFarmers: any;
  start_date?: Date;
  end_date?: Date;
  type?: string;
  taskId?: number;
  refetch?: () => void;
}

export const ChangeAssignedTasksModal: React.FC<ChangeAssignedTasksModalProps> = ({
  visible,
  onClose,
  assignedFarmers,
  start_date,
  end_date,
  type,
  taskId,
  refetch,
}) => {
  const [newFarmer, setNewFarmer] = useState<any>(null);
  const [reason, setReason] = useState<string>("");
  const { id } = useParams();
  const { formProps, saveButtonProps } = useForm({
    resource:
      type === "caring-tasks"
        ? `caring-tasks/${taskId}/farmers/${newFarmer?.id}`
        : type === "harvesting-tasks"
          ? `harvesting-tasks/${taskId}/farmers/${newFarmer?.id}`
          : `packing-tasks/${taskId}/farmers/${newFarmer?.id}`,
    action: "create",
    createMutationOptions: {
      onSuccess: () => {
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
    resource: `plans/${id}/free-farmers`,
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
  });
  const freeFarmers = freeFarmersData?.data || [];
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
export const ProductiveTaskShow = (props: ProductiveTaskShowProps) => {
  const { taskId, id } = useParams();
  const {
    data: queryResult,
    isLoading: caringLoading,
    refetch: caringRefetch,
    isFetching: caringFetching,
  } = useOne<any>({
    resource: "caring-tasks",
    id: taskId ?? props?.taskId,
    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const { token } = theme.useToken();
  const [assignedModal, setAssignedModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const getItemsFertilizerPesticide = (mode: string) => {
    switch (mode) {
      case "fertilizer":
        return [
          { title: "ID", dataIndex: "fertilizer_id", key: "id" },
          { title: "Tên", dataIndex: "fertilizer_name", key: "name" },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
          },
          { title: "Đơn vị", dataIndex: "unit", key: "unit", value: "kg" },
        ];
      case "pesticide":
        return [
          { title: "ID", dataIndex: "pesticide_id", key: "id" },
          { title: "Tên", dataIndex: "pesticide_name", key: "name" },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
          },
          { title: "Đơn vị", dataIndex: "unit", key: "unit", value: "ml" },
        ];
      case "item":
        return [
          { title: "ID", dataIndex: "item_id", key: "id" },
          { title: "Tên", dataIndex: "item_name", key: "name" },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
          },
          { title: "Đơn vị", dataIndex: "unit", key: "unit", value: "cái" },
        ];
    }
  };
  const {
    data: historyAssignedData,
    isLoading: assigned_farmersLoading,
    refetch: assigned_farmersRefetch,
  } = useList({
    resource: `caring-tasks/${taskId ?? props?.taskId}/assigned-farmers`,

    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const { data: user } = useGetIdentity<IIdentity>();
  const historyAssignedFarmers = historyAssignedData?.data || [];
  const navigate = useNavigate();
  const [dataVattu, setDataVattu] = useState<any>([]);
  const [modeVattu, setModeVattu] = useState<"fertilizer" | "pesticide" | "item">("fertilizer");
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const data = queryResult;
  const task = data?.data?.[0];
  const handleModeChange = (mode: "fertilizer" | "pesticide" | "item") => {
    setModeVattu(mode);
    setDataVattu(task ? task["care_" + mode + "s"] : []);
  };
  const {
    data: chosenFarmersData,
    isLoading: chosenFarmerLoading,
    refetch: chosenFarmerRefetch,
  } = useList({
    resource: `plans/${id}/farmers`,

    queryOptions: {
      enabled: props?.visible === true,
    },
  });
  const chosenFarmers = chosenFarmersData?.data || [];
  const columns = getItemsFertilizerPesticide(modeVattu);
  useEffect(() => {
    if (props?.visible === true && props?.taskId) {
      chosenFarmerRefetch();
      assigned_farmersRefetch();
      caringRefetch();
      return;
    } else {
      setDataVattu([]);
      setModeVattu("fertilizer");
      setVisible(false);
      setAssignedModal(false);
    }
  }, [props?.visible]);
  const { mutate } = useUpdate({
    resource: "caring-tasks",
    id: task?.id,
    mutationOptions: {
      onSuccess: () => {
        notification.success({
          message: "Thay đổi người làm thành công",
        });
        caringRefetch();
      },
    },
  });

  const handleChangeStatus = (type: string) => {
    mutate({
      id: task?.id,
      values: {
        task_name: task?.task_name,
        description: task?.description,
        start_date: task?.start_date,
        end_date: task?.end_date,
        task_type: task?.task_type,
        updated_by: user?.name,
        status: type,
        fertilizers: task?.fertilizers,
        pesticides: task?.pesticides,
        items: task?.items,
      },
    });
  };
  return (
    <Drawer
      loading={caringLoading && caringFetching}
      style={{ background: token.colorBgLayout }}
      headerStyle={{
        background: token.colorBgContainer,
      }}
      open={props?.visible}
      width={breakpoint.sm ? "60%" : "100%"}
      onClose={props?.onClose ?? back}
      title={
        <>
          {task?.status === "Ongoing" && (
            <Flex justify="end">
              <Space>
                <Button onClick={() => handleChangeStatus("Cancel")} color="danger" variant="solid">
                  Hủy bỏ
                </Button>
              </Space>
            </Flex>
          )}
          {task?.status === "Pending" && (
            <Flex justify="end">
              <Space>
                <Button color="danger" variant="solid" onClick={() => handleChangeStatus("Cancel")}>
                  Không chấp nhận
                </Button>
                <Button type="primary" onClick={() => handleChangeStatus("Ongoing")}>
                  Chấp nhận
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
              <Image.PreviewGroup items={task?.care_images?.map((x: any) => x.url) || []}>
                <Image
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.care_images?.[0].url}
                />
              </Image.PreviewGroup>
            )}
            <List
              style={{ backgroundColor: token.colorBgContainer }}
              bordered
              dataSource={[
                {
                  label: "Ngày hoàn thành",
                  value: <DateField value={task?.complete_at} />,
                },
                {
                  label: "Nội dung",
                  value: (
                    <Typography.Paragraph>
                      {task?.result_content || "Không có nội dung"}
                    </Typography.Paragraph>
                  ),
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
        <Flex justify="space-between" align="center">
          <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
          {(task?.status === "Ongoing" ||
            task?.status === "Pending" ||
            task?.status === "Draft") && (
            <Button color="primary" variant="solid" onClick={() => navigate("edit")}>
              Thay đổi
            </Button>
          )}
        </Flex>
        <List
          style={{ backgroundColor: token.colorBgContainer }}
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
            { label: "Kế hoạch", value: task?.plan_name },
            {
              label: "Vấn đề liên quan",
              value: task?.problem_name || "Không liên hệ tới vấn đề nào",
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
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={[
            {
              label: "Ngày tạo",
              value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.created_at} />,
            },
            {
              label: "Người tạo",
              value: <TextField value={task?.created_by} />,
            },
            {
              label: "Câp nhật lần cuối",
              value: task?.updated_at ? (
                <DateField format={"hh:mm DD/MM/YYYY"} value={task?.updated_at} />
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
              <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
            </List.Item>
          )}
        />
        <Divider />
        <Flex justify="space-between" gap={5}>
          <Typography.Title level={4}>Người thực hiện</Typography.Title>
          <Space>
            {" "}
            <Button type="default" onClick={() => setVisible(true)}>
              Lịch sử
            </Button>
            {(task?.status === "Ongoing" ||
              task?.status === "Pending" ||
              task?.status === "Draft") && (
              <Button type="primary" color="cyan" onClick={() => setAssignedModal(true)}>
                Thay đổi
              </Button>
            )}
          </Space>
        </Flex>
        <List
          style={{ backgroundColor: token.colorBgContainer }}
          bordered
          dataSource={[
            {
              label: "Id",
              value: <TextField value={task?.farmer_id || "Chưa giao việc"} />,
            },
            {
              label: "Tên nông dân",
              value: (
                <TextField
                  value={
                    task?.farmer_id
                      ? task?.farmer_information?.find((x: any) => x?.farmer_id === task?.farmer_id)
                          ?.farmer_name
                      : "Chưa giao việc"
                  }
                />
              ),
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
          style={{ backgroundColor: token.colorBgContainer }}
          pagination={{ pageSize: 5 }}
          bordered
          columns={columns}
          dataSource={dataVattu}
        ></Table>
      </Flex>
      <HistoryAssignedModal
        visible={visible}
        onClose={() => setVisible(false)}
        data={historyAssignedFarmers}
      />
      <ChangeAssignedTasksModal
        taskId={task?.id}
        refetch={caringRefetch}
        start_date={task?.start_date}
        end_date={task?.end_date}
        onClose={() => setAssignedModal(false)}
        visible={assignedModal}
        assignedFarmers={chosenFarmers.find((x) => x.id === task?.farmer_id)}
        type={"caring-tasks"}
      />
    </Drawer>
  );
};
