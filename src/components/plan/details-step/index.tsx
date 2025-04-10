import { Form, Input, Flex, DatePicker, InputNumber, Typography } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useLocation } from "react-router";
const { Text } = Typography;

export const DetailsStep = ({ t }: { t: (key: string) => string }) => {
  const form = Form.useFormInstance();
  const orderPlantId = form.getFieldValue("order_plant_id");
  const estimatedPerOne = form.getFieldValue("estimated_per_one");
  const location = useLocation();

  // Get totalPreorderQuantity from URL
  const getTotalPreorderQuantity = () => {
    const searchParams = new URLSearchParams(location.search);
    const totalPreorderQuantity = searchParams.get("totalPreorderQuantity");
    return totalPreorderQuantity ? parseInt(totalPreorderQuantity) : 0;
  };

  const totalPreorderQuantity = getTotalPreorderQuantity();

  useEffect(() => {
    // Ensure form values are properly set and convert string dates to dayjs objects
    const start_date = form.getFieldValue("start_date");
    const end_date = form.getFieldValue("end_date");

    if (start_date && end_date) {
      // Convert string dates to dayjs objects if they're strings
      const startDayjs = typeof start_date === "string" ? dayjs(start_date) : start_date;
      const endDayjs = typeof end_date === "string" ? dayjs(end_date) : end_date;

      form.setFieldsValue({
        start_date: startDayjs,
        end_date: endDayjs,
      });
    }
  }, [form]);

  // Calculate seed_quantity when estimated_product changes
  useEffect(() => {
    const estimatedProduct = form.getFieldValue("estimated_product");
    if (estimatedProduct && estimatedPerOne) {
      const seedQuantity = Math.ceil(estimatedProduct / estimatedPerOne);
      form.setFieldValue("seed_quantity", seedQuantity);
    }
  }, [form.getFieldValue("estimated_product"), estimatedPerOne, form]);

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

      {/* Date Range - Separate Start and End Date */}
      <Flex gap={16}>
        <Form.Item
          label={<Text strong>{t("plans.fields.startedDate.label") || "Start Date"}</Text>}
          name="start_date"
          rules={[
            {
              required: true,
              message: t("plans.fields.startedDate.required") || "Start date is required",
            },
          ]}
          style={{ flex: 1 }}
          getValueProps={(value) => {
            return { value: value ? dayjs(value) : undefined };
          }}
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%", borderRadius: "8px" }}
            size="large"
            placeholder={t("plans.fields.startedDate.placeholder") || "Select start date"}
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>{t("plans.fields.endedDate.label") || "End Date"}</Text>}
          name="end_date"
          rules={[
            {
              required: true,
              message: t("plans.fields.endedDate.required") || "End date is required",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue("start_date");
                if (!value || !start) return Promise.resolve();

                // Convert both to dayjs to ensure proper comparison
                const startDayjs = dayjs(start);
                const endDayjs = dayjs(value);

                if (endDayjs.isAfter(startDayjs)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    t("plans.fields.dateRange.endAfterStart") ||
                      "End date must be after start date",
                  ),
                );
              },
            }),
          ]}
          style={{ flex: 1 }}
          getValueProps={(value) => {
            return { value: value ? dayjs(value) : undefined };
          }}
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%", borderRadius: "8px" }}
            size="large"
            placeholder={t("plans.fields.endedDate.placeholder") || "Select end date"}
          />
        </Form.Item>
      </Flex>

      {/* Estimated Product & Unit */}
      <Flex gap={16}>
        <Form.Item
          label={<Text strong>{t("plans.fields.estimatedProduct.label")}</Text>}
          name="estimated_product"
          style={{ flex: 1 }}
          rules={[
            {
              required: true,
              message: t("plans.fields.estimatedProduct.required"),
            },
          ]}
        >
          <InputNumber
            min={orderPlantId ? form.getFieldValue("estimated_product") : totalPreorderQuantity}
            placeholder={t("plans.fields.estimatedProduct.placeholder")}
            size="large"
            style={{ width: "100%", borderRadius: "8px" }}
            onChange={(value) => {
              if (value && estimatedPerOne) {
                const seedQuantity = Math.ceil(value / estimatedPerOne);
                form.setFieldValue("seed_quantity", seedQuantity);
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>{t("plans.fields.seedQuantity.label")}</Text>}
          name="seed_quantity"
          style={{ flex: 1 }}
        >
          <InputNumber
            min={0}
            placeholder={t("plans.fields.estimatedProduct.placeholder")}
            size="large"
            style={{ width: "100%", borderRadius: "8px" }}
            disabled
          />
        </Form.Item>
      </Flex>
    </Flex>
  );
};
