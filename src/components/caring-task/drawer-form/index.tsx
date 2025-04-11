/* eslint-disable prettier/prettier */
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
import { StatusTag } from "../status-tag";
import { ProblemStatusTag } from "@/components/problem/status-tag";
import dayjs from "dayjs";
import { useParams } from "react-router";

type Props = {
  onClose?: () => void;
  problemId?: number;
  planId?: number;
  taskId?: BaseKey;
  action: "edit" | "create";
  onMutationSuccess?: () => void;
  refetch?: () => void;
  chosenFarmer?: [];
};

export const CaringTaskPage = (props: Props) => {
  const { taskId } = useParams();
  const back = useBack();
  const t = useTranslate();
  const [idProblem, setIdProblem] = useState<number | null>(null);
  const [idPlan, setIdPlan] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [fertilizerFields, setFertilizerFields] = useState<
    { id: number; quantity: number; id_block: number }[]
  >([]);
  const [pesticideFields, setPesticideFields] = useState<
    { id: number; quantity: number; id_block: number }[]
  >([]);
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
  });

  const filteredProblems = idPlan
    ? queryPendingProblems.data?.data?.filter(
        (problem) => problem.plan_id === idPlan
      )
    : [];
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
    problem_id: number;
    task_type: string;
    fertilizers: { fertilizer_id: number; quantity: number; unit: string }[];
    pesticides: { pesticide_id: number; quantity: number; unit: string }[];
    items: { item_id: number; quantity: number; unit: string }[];
  }>({
    id: taskId ?? props?.taskId,
    action: props?.action,
    resource: "caring-tasks",
    redirect: false,
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
    queryOptions: {
      onSuccess(data: any) {
        const caring_tasks = data?.data?.[0];
        if (caring_tasks) {
          const fertilizers = caring_tasks.care_fertilizers;
          const pesticides = caring_tasks.care_pesticides;
          const items = caring_tasks.care_items;

          setFertilizerFields(
            fertilizers.map((fertilizer: any, index: any) => ({
              id: fertilizer.fertilizer_id,
              quantity: fertilizer.quantity,
              id_block: index,
            }))
          );
          setPesticideFields(
            pesticides.map((pesticide: any, index: any) => ({
              id: pesticide.pesticide_id,
              quantity: pesticide.quantity,
              id_block: index,
            }))
          );
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
            problem_id: caring_tasks.problem_id,
            task_type: caring_tasks.task_type,
          });
          setIdPlan(caring_tasks.plan_id);
          setIdProblem(caring_tasks.problem_id);
        }
      },
    },
    updateMutationOptions: {
      onSuccess: () => {
        notification.success({
          message: "Cập nhật công việc chăm sóc thành công",
        });
        props.refetch?.();
        props?.refetch !== null ? props?.onClose?.() : back();
      },
    },

    createMutationOptions: {
      onSuccess: () => {
        notification.success({
          message: "Cập nhật công việc chăm sóc thành công",
        });
        props?.refetch?.();
        props?.refetch !== null ? props?.onClose?.() : back();
      },
    },
  });

  const title =
    props?.action === "edit"
      ? "Chỉnh sửa công việc chăm sóc #" + taskId
      : "Thêm công việc chăm sóc";
  const taskTypeOptions = [
    { label: t("status.watering", "Tưới nước"), value: "Watering" },
    {
      label: t("status.fertilizering", "Bón phân"),
      value: "Fertilizing",
    },
    { label: t("status.pesticiding", "Phun thuốc"), value: "Pesticide" },
    { label: t("status.setup", "Cài đặt"), value: "Setup" },
    { label: t("status.weeding", "Làm cỏ"), value: "Weeding" },
    { label: t("status.pruning", "Cắt tỉa"), value: "Pruning" },
    { label: t("status.planting", "Gieo trồng"), value: "Planting" },
    { label: t("status.nurturing", "Chăm sóc"), value: "Nurturing" },
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
    fertilizerFields &&
      formProps.form?.setFieldValue(
        "fertilizers",
        fertilizerFields.map((field) => ({
          fertilizer_id: field.id,
          quantity: field.quantity,
          unit: "kg",
        }))
      );
    pesticideFields &&
      formProps.form?.setFieldValue(
        "pesticides",
        pesticideFields.map((field) => ({
          pesticide_id: field.id,
          quantity: field.quantity,
          unit: "lit",
        }))
      );
    itemFields &&
      formProps.form?.setFieldValue(
        "items",
        itemFields.map((field) => ({
          item_id: field.id,
          quantity: field.quantity,
          unit: "unit",
        }))
      );
    if (props?.problemId !== null && props?.problemId !== undefined) {
      formProps.form?.setFieldValue("problem_id", props?.problemId);
    }
    if (props?.planId !== null && props?.planId !== undefined) {
      formProps.form?.setFieldValue("plan_id", props?.planId);
    }
    formProps.form?.setFieldValue("created_by", "Farm Owner");
    onFinish();
  };
  return (
    <>
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
          <Form.Item
            label="Loại công việc"
            name="task_type"
            rules={[{ required: true }]}
          >
            <Select options={taskTypeOptions} />
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
            label="Mô tả"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={7} />
          </Form.Item>
          <div className="form-section">
            <div className="section-header">
              <h4>{t("plans.fields.fertilizers.label", "Fertilizers")}</h4>
              <Button
                type="dashed"
                onClick={() => addField(fertilizerFields, setFertilizerFields)}
                style={{ marginBottom: 16 }}
              >
                + {t("buttons.addFertilizer", "Add Fertilizer")}
              </Button>
            </div>

            {fertilizerFields.map((field) => (
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
                    <Form.Item label="Fertilizer" rules={[{ required: true }]}>
                      <Select
                        value={field.id}
                        placeholder="Select fertilizer"
                        onChange={(value) => {
                          setFertilizerFields((prev) =>
                            prev.map((f) =>
                              f.id_block === field.id_block
                                ? { ...f, id: value }
                                : f
                            )
                          );
                        }}
                      >
                        {fertilizerData?.data.map((fertilizer) => (
                          <Select.Option
                            key={`fetilizer_${fertilizer.id}`}
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
                        value={field.quantity}
                        disabled={field.id === null}
                        min={0.1}
                        step={0.1}
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          setFertilizerFields((prev) =>
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
                    <TextField value={"/kg"} />
                  </Col>
                  <Col>
                    <Button
                      shape="circle"
                      danger
                      onClick={() =>
                        removeField(
                          field.id,
                          fertilizerFields,
                          setFertilizerFields
                        )
                      }
                    >
                      <DeleteOutlined />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
          <div className="form-section">
            <div className="section-header">
              <h4>{t("plans.fields.pesticides.label", "Pesticides")}</h4>
              <Button
                type="dashed"
                onClick={() => addField(pesticideFields, setPesticideFields)}
                style={{ marginBottom: 16 }}
              >
                + {t("buttons.addPesticides", "Add Pesticides")}
              </Button>
            </div>

            {pesticideFields.map((field) => (
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
                    <Form.Item label="Pesticides" rules={[{ required: true }]}>
                      <Select
                        value={field.id}
                        placeholder="Select Pesticides"
                        onChange={(value) => {
                          setPesticideFields((prev) =>
                            prev.map((f) =>
                              f.id_block === field.id_block
                                ? { ...f, id: value }
                                : f
                            )
                          );
                        }}
                      >
                        {pesticideData?.data.map((fertilizer) => (
                          <Select.Option
                            key={`pesticide_${fertilizer.id}`}
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
                        value={field.quantity}
                        disabled={field.id === null}
                        min={0.1}
                        step={0.1}
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          setPesticideFields((prev) =>
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
                    <TextField value={"lit"} />
                  </Col>
                  <Col>
                    <Button
                      shape="circle"
                      danger
                      onClick={() =>
                        removeField(
                          field.id,
                          pesticideFields,
                          setPesticideFields
                        )
                      }
                    >
                      <DeleteOutlined />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
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
          <Button type="primary" {...saveButtonProps} style={{ width: "100%" }}>
            {t("buttons.save", "Save")}
          </Button>
        </Form>
      </Spin>
    </>
  );
};

export default CaringTaskPage;
