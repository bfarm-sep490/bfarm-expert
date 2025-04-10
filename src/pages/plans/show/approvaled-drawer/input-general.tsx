import { Card, DatePicker, Flex, Form, Input, Select, Typography } from "antd";
import { useList } from "@refinedev/core";
import { use, useEffect, useState } from "react";
import { FormProps } from "antd/lib";
import form from "antd/es/form";
import dayjs from "dayjs";

type Props = {
  experts: any;
  yields: any;
  plants: any;
  formProps: FormProps;
};

export const InputGeneralPlan = ({ experts, yields, plants, formProps }: Props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (experts && yields && plants) {
      setLoading(false);
    }
  }, [experts, yields, plants]);
  return (
    <>
      <Form
        form={formProps.form}
        onChange={formProps.onChange}
        initialValues={formProps.initialValues}
        onFinish={formProps.onFinish}
        layout="vertical"
      >
        <Flex justify="center" align="center">
          <Card
            loading={loading}
            style={{ width: "60%" }}
            title={
              <Typography.Title style={{ textAlign: "center" }} level={4}>
                Thông tin kế hoạch
              </Typography.Title>
            }
          >
            <Flex vertical>
              <Form.Item
                label="Tên kế hoạch"
                name="plan_name"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Nhập tên kế hoạch" }]}
              >
                <Input placeholder="Nhập tên kế hoạch" />
              </Form.Item>
              <Form.Item
                label="Chọn cây trồng"
                name="plant_id"
                rules={[{ required: true, message: "Chọn cây trồng" }]}
              >
                <Select
                  value={formProps.form?.getFieldValue("plant_id")}
                  onChange={(value: any) => formProps.form?.setFieldValue("plant_id", value)}
                >
                  {plants &&
                    plants.map((plant: any) => (
                      <Select.Option key={plant?.id} value={plant?.id}>
                        #{plant?.id} - {plant?.plant_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Chọn khu đất"
                name="yield_id"
                rules={[{ required: true, message: "Chọn khu đất" }]}
              >
                <Select
                  value={formProps.form?.getFieldValue("yield_id")}
                  onChange={(value: any) => formProps.form?.setFieldValue("yield_id", value)}
                >
                  {yields &&
                    yields.map((expert: any) => (
                      <Select.Option key={expert?.id} value={expert?.id}>
                        #{expert?.id} - {expert?.yield_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Chọn chuyên gia"
                name="expert_id"
                rules={[{ required: true, message: "Chọn chuyên gia" }]}
              >
                <Select
                  value={formProps.form?.getFieldValue("expert_id")}
                  onChange={(value: any) => formProps.form?.setFieldValue("expert_id", value)}
                >
                  {experts &&
                    experts.map((expert: any) => (
                      <Select.Option key={expert?.id} value={expert?.id}>
                        #{expert?.id} - {expert?.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Flex gap={10} align="center">
                <Form.Item
                  label="Sản lượng dự kiến"
                  name="estimated_product"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Nhập sản lượng dự kiến" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="estimated_unit"
                  rules={[{ required: true, message: "Chọn đơn vị" }]}
                >
                  <Select
                    value={formProps.form?.getFieldValue("estimated_unit")}
                    onChange={(value: any) =>
                      formProps.form?.setFieldValue("estimated_unit", value)
                    }
                    style={{ width: "100px" }}
                  >
                    <Select.Option key={"kg"} value={"kg"}>
                      {"Kg"}
                    </Select.Option>

                    <Select.Option key={"ton"} value={"ton"}>
                      {"Ton"}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Flex>
              <Flex>
                <Form.Item label="Ngày bắt đầu dự kiến">
                  <Flex gap={10}>
                    <DatePicker
                      value={dayjs(formProps?.form?.getFieldValue("start_date"))}
                      format="DD/MM/YYYY"
                      onChange={(value: any) => {
                        formProps?.form?.setFieldValue(
                          "start_date",
                          dayjs(value).format("YYYY-MM-DD"),
                        );
                      }}
                      key={"start_date"}
                      placeholder="Ngày bắt đầu dự kiến"
                    />
                  </Flex>
                </Form.Item>
                <Form.Item label="Ngày kết thúc dự kiến">
                  <Flex gap={10}>
                    <DatePicker
                      value={dayjs(formProps?.form?.getFieldValue("end_date"))}
                      defaultValue={dayjs(formProps?.form?.getFieldValue("end_date"))}
                      format="DD/MM/YYYY"
                      onChange={(value: any) => {
                        formProps?.form?.setFieldValue(
                          "end_date",
                          dayjs(value).format("YYYY-MM-DD"),
                        );
                      }}
                      key={"end_date"}
                      placeholder="Ngày kết thúc"
                    />
                  </Flex>
                </Form.Item>
              </Flex>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea size="large" />
              </Form.Item>
            </Flex>
          </Card>
        </Flex>
      </Form>
    </>
  );
};
