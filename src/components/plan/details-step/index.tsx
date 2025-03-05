import { Form, Select, Input, Flex, DatePicker, InputNumber, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
const { RangePicker } = DatePicker;
const { Text } = Typography;

export const DetailsStep = ({ t }: { t: (key: string) => string }) => {
  const form = Form.useFormInstance();

  const handleRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      form.setFieldsValue({
        start_date: dates[0],
        end_date: dates[1],
      });
    } else {
      form.setFieldsValue({
        start_date: null,
        end_date: null,
      });
    }
  };

  // Đồng bộ giá trị ban đầu từ form khi component mount
  useEffect(() => {
    const start_date = form.getFieldValue("start_date");
    const end_date = form.getFieldValue("end_date");
    if (start_date && end_date) {
      form.setFieldsValue({
        start_date,
        end_date,
      });
    }
  }, [form]);

  return (
    <Flex vertical>
      {/* Plan Name */}
      <Form.Item
        label={<Text strong>{t("plans.fields.planName.label")}</Text>}
        name="plan_name"
        rules={[{ required: true, message: t("plans.fields.planName.required") }]}
      >
        <Input
          placeholder={t("plans.fields.planName.placeholder")}
          size="large"
          style={{ borderRadius: "8px" }}
        />
      </Form.Item>

      {/* Description */}
      <Form.Item
        label={<Text strong>{t("plans.fields.description.label")}</Text>}
        name="description"
      >
        <Input.TextArea
          rows={4}
          placeholder={t("plans.fields.description.placeholder")}
          size="large"
          style={{ borderRadius: "8px" }}
        />
      </Form.Item>

      {/* Date Range */}
      <Form.Item
        label={<Text strong>{t("plans.fields.dateRange.label")}</Text>}
        name="dateRange" // Thêm name để validation hoạt động trực tiếp trên RangePicker
        rules={[
          {
            required: true,
            message: t("plans.fields.dateRange.required"),
            validator: (_, value) =>
              value && value[0] && value[1]
                ? Promise.resolve()
                : Promise.reject(new Error(t("plans.fields.dateRange.required"))),
          },
        ]}
      >
        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          style={{ width: "100%", borderRadius: "8px" }}
          size="large"
          placeholder={[
            t("plans.fields.startedDate.placeholder"),
            t("plans.fields.endedDate.placeholder"),
          ]}
          onChange={(dates) => {
            handleRangeChange(dates);
            form.setFieldsValue({ dateRange: dates }); // Đồng bộ với field dateRange
          }}
          value={
            form.getFieldValue("start_date") && form.getFieldValue("end_date")
              ? [form.getFieldValue("start_date"), form.getFieldValue("end_date")]
              : null
          }
        />
      </Form.Item>

      {/* Hidden Fields */}
      <Form.Item name="start_date" hidden noStyle>
        <Input hidden />
      </Form.Item>
      <Form.Item name="end_date" hidden noStyle>
        <Input hidden />
      </Form.Item>

      {/* Estimated Product & Unit */}
      <Flex gap={16} align="flex-start">
        <Form.Item
          label={<Text strong>{t("plans.fields.estimatedProduct.label")}</Text>}
          name="estimatedProduct"
          style={{ flex: 1 }}
        >
          <InputNumber
            min={0}
            placeholder={t("plans.fields.estimatedProduct.placeholder")}
            size="large"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>{t("plans.fields.estimatedUnit.label")}</Text>}
          name="estimatedUnit"
          style={{ width: "320px" }}
        >
          <Select
            options={[
              { label: "kg", value: "kg" },
              { label: "ton", value: "ton" },
            ]}
            placeholder={t("plans.fields.estimatedUnit.placeholder")}
            size="large"
            style={{ borderRadius: "8px" }}
          />
        </Form.Item>
      </Flex>
    </Flex>
  );
};
