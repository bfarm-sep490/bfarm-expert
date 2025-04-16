import { useTranslate } from "@refinedev/core";
import { UseFormReturnType } from "@refinedev/antd";
import { Space, Form, Input, Select, DatePicker, theme, Row, Col } from "antd";
import { ShopOutlined, TagOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { IPlant, Template } from "@/interfaces";
import dayjs from "dayjs";

interface BasicInformationProps {
  formProps: UseFormReturnType<IPlant>["formProps"];
  selectedTemplate: Template | null;
  plantsOptions: { label: string; value: number }[];
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formProps,
  selectedTemplate,
  plantsOptions,
}) => {
  const t = useTranslate();
  const { token } = theme.useToken();

  const validateEndDate = (_: any, value: dayjs.Dayjs) => {
    const startDate = formProps.form?.getFieldValue("start_date");
    if (startDate && value && value.isBefore(startDate)) {
      return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
    }
    return Promise.resolve();
  };

  const validateStartDate = (_: any, value: dayjs.Dayjs) => {
    const endDate = formProps.form?.getFieldValue("end_date");
    if (endDate && value && value.isAfter(endDate)) {
      return Promise.reject("Ngày bắt đầu phải trước ngày kết thúc");
    }
    return Promise.resolve();
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Form.Item
        label={
          <span>
            <ShopOutlined /> {t("plans.fields.planName.label")}
          </span>
        }
        name="plan_name"
        rules={[
          { required: true, message: t("plans.fields.planName.required") },
          { max: 100, message: "Tên kế hoạch không được vượt quá 100 ký tự" },
          { whitespace: true, message: "Tên kế hoạch không được chỉ chứa khoảng trắng" },
        ]}
        initialValue={selectedTemplate ? `Kế hoạch ${selectedTemplate.name}` : undefined}
      >
        <Input
          size="large"
          placeholder={t("plans.fields.planName.placeholder")}
          prefix={<ShopOutlined style={{ color: token.colorTextTertiary }} />}
        />
      </Form.Item>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <ShopOutlined /> {t("plans.fields.plant.label")}
              </span>
            }
            name="plant_id"
            rules={[
              { required: true, message: t("plans.fields.plant.required") },
              { type: "number", message: "Vui lòng chọn cây trồng" },
            ]}
            initialValue={selectedTemplate?.plant_id}
          >
            <Select
              size="large"
              placeholder={t("plans.fields.plant.placeholder")}
              options={plantsOptions}
              showSearch
              optionFilterProp="label"
              notFoundContent="Không tìm thấy cây trồng"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <TagOutlined /> {t("plans.fields.season.label")}
              </span>
            }
            name="season_name"
            rules={[
              { required: true, message: t("plans.fields.season.required") },
              { type: "string", message: "Vui lòng chọn mùa vụ" },
            ]}
            initialValue={selectedTemplate?.season_name}
          >
            <Select
              size="large"
              placeholder={t("plans.fields.season.placeholder")}
              options={[
                { value: "Quanh năm", label: "Quanh năm" },
                { value: "Xuân", label: "Xuân" },
                { value: "Hạ", label: "Hạ" },
                { value: "Thu", label: "Thu" },
                { value: "Đông", label: "Đông" },
              ]}
              notFoundContent="Không tìm thấy mùa vụ"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <CalendarOutlined /> {t("plans.fields.startDate.label")}
              </span>
            }
            name="start_date"
            rules={[
              { required: true, message: t("plans.fields.startDate.required") },
              { validator: validateStartDate },
            ]}
            initialValue={
              selectedTemplate?.start_date ? dayjs(selectedTemplate.start_date) : undefined
            }
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <CalendarOutlined /> {t("plans.fields.endDate.label")}
              </span>
            }
            name="end_date"
            rules={[
              { required: true, message: t("plans.fields.endDate.required") },
              { validator: validateEndDate },
            ]}
            initialValue={selectedTemplate?.end_date ? dayjs(selectedTemplate.end_date) : undefined}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) => {
                const startDate = formProps.form?.getFieldValue("start_date");
                return current && startDate && current < dayjs(startDate).startOf("day");
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={
          <span>
            <FileTextOutlined /> {t("plans.fields.description.label")}
          </span>
        }
        name="description"
        rules={[{ max: 500, message: "Mô tả không được vượt quá 500 ký tự", required: true }]}
        initialValue={selectedTemplate?.description}
      >
        <Input.TextArea
          rows={3}
          placeholder={t("plans.fields.description.placeholder")}
          style={{ resize: "none" }}
          showCount
          maxLength={500}
        />
      </Form.Item>
    </Space>
  );
};
