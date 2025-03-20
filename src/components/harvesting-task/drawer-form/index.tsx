import { TextField, useForm } from "@refinedev/antd";
import {
  type BaseKey,
  useBack,
  useGo,
  useList,
  useTranslate,
} from "@refinedev/core";
import {
  Form,
  Input,
  Select,
  Button,
  Spin,
  DatePicker,
  Card,
  Row,
  Col,
  InputNumber,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusTag } from "../../caring-task/status-tag";
import { ProblemStatusTag } from "@/components/problem/status-tag";
import dayjs from "dayjs";
import { useParams } from "react-router";

type Props = {
  taskId?: BaseKey;
  action: "edit" | "create";
  onMutationSuccess?: () => void;
};

export const HarvestingTaskForm = (props: Props) => {
  const { taskId } = useParams();
  const back = useBack();
  const t = useTranslate();
  const [idPlan, setIdPlan] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const [itemFields, setItemFields] = useState<
    { id: number; quantity: number; id_block: number }[]
  >([]);

  const queryPendingPlans = useList({
    resource: "plans",
    filters: [{ field: "status", operator: "eq", value: "Pending" }],
  });

  const queryOngoingPlans = useList({
    resource: "plans",
    filters: [{ field: "status", operator: "eq", value: "Ongoing" }],
  });

  const plans = [
    ...(queryPendingPlans.data?.data || []),
    ...(queryOngoingPlans?.data?.data || []),
  ];

  const queryPendingProblems = useList({
    resource: "problems",
    filters: [{ field: "status", operator: "eq", value: "Pending" }],
  });

  const { data: fertilizerData } = useList({
    resource: "fertilizers",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Available",
      },
    ],
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
  });
  const { data: itemData } = useList({
    resource: "items",
  });
  const { formProps, formLoading, onFinish, saveButtonProps } = useForm<{
    id?: number;
    task_name: string;
    start_date: string;
    end_date: string;
    status: string;
    description: string;
    plan_id: number;
    items: { item_id: number; quantity: number; unit: string }[];
  }>({
    id: taskId,
    action: props?.action,
    resource: "harvesting-tasks",
    redirect: false,
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
    queryOptions: {
      onSuccess(data: any) {
        const caring_tasks = data?.data?.[0];
        if (caring_tasks) {
          const items = caring_tasks.harvesting_items;
          setItemFields(
            items.map((item: any, index: any) => ({
              id: item.item_id,
              quantity: item.quantity,
              id_block: index,
            }))
          );

          formProps.form?.setFieldsValue({
            id: caring_tasks.id,
            task_name: caring_tasks.task_name,
            start_date: dayjs(caring_tasks.start_date),
            end_date: dayjs(caring_tasks.end_date),
            status: caring_tasks.status,
            description: caring_tasks.description,
            plan_id: caring_tasks.plan_id,
          });
          setIdPlan(caring_tasks.plan_id);
        }
      },
    },
    updateMutationOptions: {
      onSuccess: () => {
        notification.success({
          message: "Cập nhật công việc thu hoạch thành công",
        });
        back();
      },
    },

    createMutationOptions: {
      onSuccess: () => {
        notification.success({
          message: "Cập nhật công việc thu hoạch thành công",
        });
        back();
      },
    },
  });

  const title =
    props?.action === "edit"
      ? "Chỉnh sửa công việc thu hoạch #" + taskId
      : "Thêm công việc thu hoạch";

  const statusOptions = [
    { label: t("status.draft", "Nháp"), value: "Draft" },
    { label: t("status.pending", "Chờ xử lý"), value: "Pending" },
    { label: t("status.cancel", "Đang thực hiện"), value: "Ongoing" },
    { label: t("status.complete", "Hoàn thành"), value: "Complete" },
    { label: t("status.cancel", "Hủy bỏ"), value: "Cancel" },
    { label: t("status.incomplete", "Chưa hoàn thành"), value: "Incomplete" },
    { label: t("status.unapprove", "Không phê duyệt"), value: "Unapprove" },
  ];
  const addField = (
    list: any[],
    setList: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const newList = [
      ...list,
      {
        id: null,
        quantity: 0,
        id_block: list[list.length - 1]?.id_block + 1 || 0,
      },
    ];
    setList(newList);
  };

  const removeField = (
    id: number,
    list: any[],
    setList: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };
  const handleFinish = () => {
    itemFields &&
      formProps.form?.setFieldValue(
        "items",
        itemFields.map((field) => ({
          item_id: field.id,
          quantity: field.quantity,
          unit: "unit",
        }))
      );
    formProps.form?.setFieldValue("created_by", "Farm Owner");
    onFinish();
  };
  return (
    <>
      <Button
        type="text"
        onClick={back}
        style={{ width: "40px", height: "40px" }}
      >
        <ArrowLeftOutlined style={{ fontSize: "20px" }} />
      </Button>
      <Card
        title={title}
        style={{ width: "100%", margin: "0 auto", padding: "16px" }}
      >
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
              rules={[{ required: true }]}
            >
              <Input name="task_name" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu dự kiến"
                  name="start_date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    value={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      if (endDate && date && date.isAfter(endDate, "day")) {
                        setEndDate(null);
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc dự kiến"
                  name="end_date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    value={endDate}
                    onChange={setEndDate}
                    disabledDate={(current) => {
                      return startDate
                        ? current && current.isBefore(startDate, "day")
                        : false;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Kế hoạch liên quan"
              name="plan_id"
              rules={[{ required: true }]}
            >
              <Select
                value={idPlan}
                onChange={(value) => {
                  setIdPlan(value);
                }}
              >
                {plans.map((x) => (
                  <Select.Option key={x.id} value={x.id}>
                    <StatusTag status={x.status} /> {x.plan_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={7} />
            </Form.Item>
            <div className="form-section">
              <div className="section-header">
                <h4>{t("plans.fields.items.label", "Items")}</h4>
                <Button
                  type="dashed"
                  onClick={() => addField(itemFields, setItemFields)}
                  style={{ marginBottom: 16 }}
                >
                  + {t("buttons.addItems", "Add Items")}
                </Button>
              </div>

              {itemFields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    marginBottom: 16,
                    border: "1px dashed #d9d9d9",
                    padding: 16,
                    borderRadius: 4,
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={10}>
                      <Form.Item label="Items" rules={[{ required: true }]}>
                        <Select
                          value={field.id}
                          placeholder="Select Items"
                          onChange={(value) => {
                            setItemFields((prev) =>
                              prev.map((f) =>
                                f.id_block === field.id_block
                                  ? { ...f, id: value }
                                  : f
                              )
                            );
                          }}
                        >
                          {itemData?.data.map((fertilizer) => (
                            <Select.Option
                              key={`item_${fertilizer.id}`}
                              value={fertilizer.id}
                            >
                              {fertilizer.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Quantity" rules={[{ required: true }]}>
                        <InputNumber
                          disabled={field.id === null}
                          value={field.quantity}
                          min={0.1}
                          step={0.1}
                          style={{ width: "100%" }}
                          onChange={(value) =>
                            setItemFields((prev) =>
                              prev.map((f) =>
                                f.id_block === field.id_block
                                  ? { ...f, quantity: value || 0 }
                                  : f
                              )
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
                        onClick={() =>
                          removeField(field.id, itemFields, setItemFields)
                        }
                      >
                        <DeleteOutlined />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
            <Button
              type="primary"
              {...saveButtonProps}
              style={{ width: "100%" }}
            >
              {t("buttons.save", "Save")}
            </Button>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default HarvestingTaskForm;
