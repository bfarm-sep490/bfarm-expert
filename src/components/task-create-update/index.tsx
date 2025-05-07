import { TextField, Title, useForm } from "@refinedev/antd";
import { useBack, useList, useTranslate, useCreate } from "@refinedev/core";
import {
  Form,
  Input,
  Select,
  Button,
  Spin,
  DatePicker,
  Row,
  Col,
  InputNumber,
  notification,
  Modal,
  Divider,
  Flex,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type TaskItem = {
  id: number;
  quantity: number;
  id_block: number;
};

type TaskModalProps = {
  taskId?: number;
  planId?: number;
  problemId?: number;
  status?: string;
  taskType?: "caring" | "harvesting" | "packaging";
  action: "edit" | "create";
  visible: boolean;
  onClose: () => void;
  onMutationSuccess?: () => void;
  refetch?: () => void;
};

export const TaskModal = (props: TaskModalProps) => {
  const [taskType, setTaskType] = useState<keyof typeof resourceMap>("caring");
  const back = useBack();
  const t = useTranslate();
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [fertilizerFields, setFertilizerFields] = useState<TaskItem[]>([]);
  const [pesticideFields, setPesticideFields] = useState<TaskItem[]>([]);
  const [itemFields, setItemFields] = useState<TaskItem[]>([]);

  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    setTaskType(props?.taskType || "caring");
  }, [props?.taskType]);
  const { data: fertilizerData } = useList({
    resource: "fertilizers",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Available",
      },
    ],
    queryOptions: {
      enabled: taskType === "caring" && props?.visible,
    },
  });

  const { data: pesticideData } = useList({
    resource: "pesticides",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Available",
      },
    ],
    queryOptions: {
      enabled: taskType === "caring" && props?.visible,
    },
  });

  const { data: itemData } = useList({
    resource: "items",
    queryOptions: {
      enabled: props?.visible,
    },
  });

  const { data: packagingTypesData } = useList({
    resource: "packaging-types",
    queryOptions: {
      enabled: taskType === "packaging" && props?.visible,
    },
  });
  const { data: orderData, isLoading: orderLoading } = useList({
    resource: "orders",
    queryOptions: {
      enabled: props?.visible && taskType === "packaging",
    },
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: props?.planId,
      },
    ],
  });
  const resourceMap = {
    caring: "caring-tasks",
    harvesting: "harvesting-tasks",
    packaging: "packaging-tasks",
  };

  const successMessageMap = {
    caring: "Cập nhật công việc chăm sóc thành công",
    harvesting: "Cập nhật công việc thu hoạch thành công",
    packaging: "Cập nhật công việc đóng gói thành công",
  };
  const { formProps, formLoading, onFinish, saveButtonProps } = useForm({
    id: props?.taskId,
    action: props?.action,
    resource: resourceMap[taskType],
    redirect: false,
    onMutationSuccess: () => {
      props?.onMutationSuccess?.();
    },
    queryOptions: {
      enabled: props?.visible && props?.action === "edit",
      onSuccess(data: any) {
        const taskData = data?.data?.[0];
        if (taskData) {
          if (taskType === "caring") {
            const fertilizers = taskData.care_fertilizers || [];
            const pesticides = taskData.care_pesticides || [];
            const items = taskData.care_items || [];

            setFertilizerFields(
              fertilizers.map((fertilizer: any, index: number) => ({
                id: fertilizer.fertilizer_id,
                quantity: fertilizer.quantity,
                id_block: index,
              })),
            );

            setPesticideFields(
              pesticides.map((pesticide: any, index: number) => ({
                id: pesticide.pesticide_id,
                quantity: pesticide.quantity,
                id_block: index,
              })),
            );

            setItemFields(
              items.map((item: any, index: number) => ({
                id: item.item_id,
                quantity: item.quantity,
                id_block: index,
              })),
            );

            formProps.form?.setFieldsValue({
              task_type: taskData.task_type,
            });
          } else if (taskType === "harvesting") {
            const items = taskData.harvesting_items || [];

            setItemFields(
              items.map((item: any, index: number) => ({
                id: item.item_id,
                quantity: item.quantity,
                id_block: index,
              })),
            );
          } else if (taskType === "packaging") {
            const items = taskData.packaging_items || [];

            setItemFields(
              items.map((item: any, index: number) => ({
                id: item.item_id,
                quantity: item.quantity,
                id_block: index,
              })),
            );

            formProps.form?.setFieldsValue({
              packaging_type_id: taskData.packaging_type_id,
            });
          }

          formProps.form?.setFieldsValue({
            id: taskData.id,
            task_name: taskData.task_name,
            start_date: dayjs(taskData.start_date),
            end_date: dayjs(taskData.end_date),
            status: taskData.status,
            description: taskData.description,
            plan_id: taskData.plan_id,
            problem_id: taskData.problem_id,
          });

          setStartDate(dayjs(taskData.start_date));
          setEndDate(dayjs(taskData.end_date));
        }
      },
    },
    updateMutationOptions: {
      onSuccess: () => {
        api.success({
          message: successMessageMap[taskType],
        });
        props?.refetch?.();
        props?.refetch ? props?.onClose?.() : back();
      },
    },
    createMutationOptions: {
      onSuccess: () => {
        api.success({
          message: successMessageMap[taskType],
        });
        props?.refetch?.();
        props?.refetch ? props?.onClose?.() : back();
      },
    },
  });

  const addField = (
    list: TaskItem[],
    setList: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  ) => {
    const newList = [
      ...list,
      {
        id: 0,
        quantity: 0,
        id_block: list[list.length - 1]?.id_block + 1 || 0,
      },
    ];
    setList(newList);
  };

  const removeField = (
    id: number,
    list: TaskItem[],
    setList: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  ) => {
    const newList = list.filter((item) => item.id_block !== id);
    setList(newList);
  };

  const handleFinish = () => {
    if (taskType === "caring") {
      formProps.form?.setFieldValue(
        "fertilizers",
        fertilizerFields.map((field) => ({
          fertilizer_id: field.id,
          quantity: field.quantity,
          unit: "kg",
        })),
      );

      formProps.form?.setFieldValue(
        "pesticides",
        pesticideFields.map((field) => ({
          pesticide_id: field.id,
          quantity: field.quantity,
          unit: "lit",
        })),
      );
    }

    formProps.form?.setFieldValue(
      "items",
      itemFields.map((field) => ({
        item_id: field.id,
        quantity: field.quantity,
        unit: "unit",
      })),
    );

    if (props?.problemId) {
      formProps.form?.setFieldValue("problem_id", props?.problemId);
    }

    if (props?.planId) {
      formProps.form?.setFieldValue("plan_id", props?.planId);
    }

    if (props?.status) {
      formProps.form?.setFieldValue("status", props?.status);
    }

    formProps.form?.setFieldValue("created_by", "Farm Owner");
    onFinish();
  };

  const taskTypeOptions = [
    { label: t("status.watering", "Tưới nước"), value: "Watering" },
    { label: t("status.fertilizering", "Bón phân"), value: "Fertilizing" },
    { label: t("status.pesticiding", "Phun thuốc"), value: "Pesticide" },
    { label: t("status.setup", "Cài đặt"), value: "Setup" },
    { label: t("status.weeding", "Làm cỏ"), value: "Weeding" },
    { label: t("status.pruning", "Cắt tỉa"), value: "Pruning" },
    { label: t("status.planting", "Gieo trồng"), value: "Planting" },
    { label: t("status.nurturing", "Chăm sóc"), value: "Nurturing" },
  ];

  const handleChange = (value: string) => {
    setTaskType(value as keyof typeof resourceMap);
    setFertilizerFields([]);
    setPesticideFields([]);
    setItemFields([]);
    formProps.form?.resetFields();
  };
  useEffect(() => {
    if (props?.visible === false) {
      setFertilizerFields([]);
      setPesticideFields([]);
      setItemFields([]);
      setStartDate(null);
      setEndDate(null);
      formProps.form?.resetFields();
    }
  }, [props?.visible]);
  return (
    <Modal
      title={
        props?.action === "create"
          ? `Tạo công việc ${taskType === "caring" ? "chăm sóc" : taskType === "harvesting" ? "thu hoạch" : "đóng gói"} mới`
          : `Cập nhật công việc ${taskType === "caring" ? "chăm sóc" : taskType === "harvesting" ? "thu hoạch" : "đóng gói"}`
      }
      open={props?.visible}
      onCancel={props?.onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      {props?.action === "create" && props?.problemId === null && (
        <Flex>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            Chọn loại công việc
          </Typography.Title>
          <Select onChange={(value) => handleChange(value)} defaultValue={taskType}>
            <Select.Option value="caring">Chăm sóc</Select.Option>
            <Select.Option value="harvesting">Thu hoạch</Select.Option>
            <Select.Option value="packaging">Đóng gói</Select.Option>
          </Select>
        </Flex>
      )}
      {contextHolder}
      <Spin spinning={formLoading}>
        <Form
          form={formProps?.form}
          onValuesChange={formProps?.onValuesChange}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Tên công việc"
            name="task_name"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
          >
            <Input name="task_name" />
          </Form.Item>

          <Form.Item name="plan_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="problem_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>

          {taskType === "caring" && (
            <Form.Item
              label="Loại công việc chăm sóc"
              name="task_type"
              rules={[{ required: true, message: "Vui lòng chọn loại công việc" }]}
            >
              <Select options={taskTypeOptions} />
            </Form.Item>
          )}

          {taskType === "packaging" && (
            <>
              <Form.Item
                label="Loại bao bì"
                name="packaging_type_id"
                rules={[{ required: true, message: "Vui lòng chọn loại bao bì" }]}
              >
                <Select>
                  {packagingTypesData?.data.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Đơn hàng" name="order_id">
                <Select>
                  {orderData?.data
                    ?.filter((order) => order?.status === "Active")
                    .map((order) => (
                      <Select.Option key={order?.id} value={order?.id}>
                        {"#" + order?.id + "." + order?.retailer_name}
                      </Select.Option>
                    ))}
                  <Select.Option key={"nullable_order_id"} value={null}>
                    Không đơn hàng liên quan
                  </Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu dự kiến"
                name="start_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (endDate && date && date.isAfter(endDate, "day")) {
                      setEndDate(null);
                      formProps.form?.setFieldValue("end_date", null);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc dự kiến"
                name="end_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  value={endDate}
                  onChange={setEndDate}
                  disabledDate={(current) => {
                    return startDate ? current && current.isBefore(startDate, "day") : false;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>

          {taskType === "caring" && (
            <div className="form-section">
              <Divider orientation="left">Phân bón</Divider>
              <div
                className="section-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Button
                  type="dashed"
                  onClick={() => addField(fertilizerFields, setFertilizerFields)}
                >
                  + Thêm phân bón
                </Button>
              </div>

              {fertilizerFields.map((field) => (
                <div
                  key={field.id_block}
                  style={{
                    marginBottom: 16,
                    border: "1px dashed #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={10}>
                      <Form.Item label="Phân bón" rules={[{ required: true }]}>
                        <Select
                          value={field.id}
                          placeholder="Chọn phân bón"
                          onChange={(value) => {
                            setFertilizerFields((prev) =>
                              prev.map((f) =>
                                f.id_block === field.id_block ? { ...f, id: value } : f,
                              ),
                            );
                          }}
                        >
                          {fertilizerData?.data.map((fertilizer) => (
                            <Select.Option
                              key={`fertilizer_${fertilizer.id}`}
                              value={fertilizer.id}
                            >
                              {fertilizer.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Số lượng" rules={[{ required: true }]}>
                        <InputNumber
                          value={field.quantity}
                          disabled={field.id === null}
                          min={0.1}
                          step={0.1}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            setFertilizerFields((prev) =>
                              prev.map((f) =>
                                f.id_block === field.id_block ? { ...f, quantity: value || 0 } : f,
                              ),
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <TextField value={"/kg"} />
                    </Col>
                    <Col>
                      <Button
                        shape="circle"
                        danger
                        onClick={() =>
                          removeField(field.id_block, fertilizerFields, setFertilizerFields)
                        }
                      >
                        <DeleteOutlined />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}

          {taskType === "caring" && (
            <div className="form-section">
              <Divider orientation="left">Thuốc bảo vệ thực vật</Divider>
              <div
                className="section-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Button type="dashed" onClick={() => addField(pesticideFields, setPesticideFields)}>
                  + Thêm thuốc
                </Button>
              </div>

              {pesticideFields.map((field) => (
                <div
                  key={field.id_block}
                  style={{
                    marginBottom: 16,
                    border: "1px dashed #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={10}>
                      <Form.Item label="Thuốc BVTV" rules={[{ required: true }]}>
                        <Select
                          value={field.id}
                          placeholder="Chọn thuốc BVTV"
                          onChange={(value) => {
                            setPesticideFields((prev) =>
                              prev.map((f) =>
                                f.id_block === field.id_block ? { ...f, id: value } : f,
                              ),
                            );
                          }}
                        >
                          {pesticideData?.data.map((pesticide) => (
                            <Select.Option key={`pesticide_${pesticide.id}`} value={pesticide.id}>
                              {pesticide.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Số lượng" rules={[{ required: true }]}>
                        <InputNumber
                          value={field.quantity}
                          disabled={field.id === null}
                          min={0.1}
                          step={0.1}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            setPesticideFields((prev) =>
                              prev.map((f) =>
                                f.id_block === field.id_block ? { ...f, quantity: value || 0 } : f,
                              ),
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <TextField value={"lit"} />
                    </Col>
                    <Col>
                      <Button
                        shape="circle"
                        danger
                        onClick={() =>
                          removeField(field.id_block, pesticideFields, setPesticideFields)
                        }
                      >
                        <DeleteOutlined />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}

          <div className="form-section">
            <Divider orientation="left">Vật tư</Divider>
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Button type="dashed" onClick={() => addField(itemFields, setItemFields)}>
                + Thêm vật tư
              </Button>
            </div>

            {itemFields.map((field) => (
              <div
                key={field.id_block}
                style={{
                  marginBottom: 16,
                  border: "1px dashed #d9d9d9",
                  padding: 16,
                  borderRadius: 4,
                }}
              >
                <Row gutter={16} align="middle">
                  <Col span={10}>
                    <Form.Item label="Vật tư" rules={[{ required: true }]}>
                      <Select
                        value={field.id}
                        placeholder="Chọn vật tư"
                        onChange={(value) => {
                          setItemFields((prev) =>
                            prev.map((f) =>
                              f.id_block === field.id_block ? { ...f, id: value } : f,
                            ),
                          );
                        }}
                      >
                        {itemData?.data.map((item) => (
                          <Select.Option key={`item_${item.id}`} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="Số lượng" rules={[{ required: true }]}>
                      <InputNumber
                        disabled={field.id === null}
                        value={field.quantity}
                        min={0.1}
                        step={0.1}
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          setItemFields((prev) =>
                            prev.map((f) =>
                              f.id_block === field.id_block ? { ...f, quantity: value || 0 } : f,
                            ),
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <TextField value={"unit"} />
                  </Col>
                  <Col>
                    <Button
                      shape="circle"
                      danger
                      onClick={() => removeField(field.id_block, itemFields, setItemFields)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {props?.action === "create" ? "Tạo công việc" : "Cập nhật công việc"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default TaskModal;
