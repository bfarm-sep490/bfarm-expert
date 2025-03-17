import { useTranslate, useGetToPath, useGo } from "@refinedev/core";
import { SaveButton, useStepsForm, type UseFormReturnType } from "@refinedev/antd";
import {
  Form,
  Input,
  Button,
  Steps,
  Modal,
  Flex,
  theme,
  Select,
  InputNumber,
  Card,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  DollarOutlined,
  TagOutlined,
  ShopOutlined,
  NumberOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  UploadOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import type { IPlant } from "../../interfaces";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

export const PlantCreate = () => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { token } = theme.useToken();

  const { current, gotoStep, stepsProps, formProps, saveButtonProps } = useStepsForm<IPlant>();
  const { formList } = useFormList({ formProps });

  const handleModalClose = () => {
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const isLastStep = current === formList.length - 1;
  const isFirstStep = current === 0;

  return (
    <Modal
      open
      destroyOnClose
      maskClosable={false}
      title={
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>{t("plants.actions.add")}</span>
      }
      width={600} // Increased width for better spacing
      styles={{
        header: { padding: "16px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` },
        footer: { padding: "16px 24px", borderTop: `1px solid ${token.colorBorderSecondary}` },
        content: { padding: 0, background: token.colorBgContainer },
      }}
      footer={() => (
        <Flex align="center" justify="space-between">
          <Button size="large" onClick={handleModalClose}>
            {t("buttons.cancel")}
          </Button>
          <Flex align="center" gap={16}>
            <Button size="large" disabled={isFirstStep} onClick={() => gotoStep(current - 1)}>
              {t("buttons.previousStep")}
            </Button>
            {isLastStep ? (
              <SaveButton
                size="large"
                icon={<CheckCircleOutlined />}
                {...saveButtonProps}
                type="primary"
              />
            ) : (
              <Button size="large" type="primary" onClick={() => gotoStep(current + 1)}>
                {t("buttons.nextStep")}
              </Button>
            )}
          </Flex>
        </Flex>
      )}
      onCancel={handleModalClose}
    >
      <Flex vertical style={{ padding: "16px 24px" }}>
        <Steps {...stepsProps} responsive current={current} style={{ marginBottom: "24px" }}>
          <Steps.Step title={t("plants.steps.basic")} icon={<InfoCircleOutlined />} />
          <Steps.Step title={t("plants.steps.details")} icon={<DollarOutlined />} />
        </Steps>
        <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Form {...formProps} layout="vertical" style={{ padding: "16px" }}>
            {formList[current]}
          </Form>
        </Card>
      </Flex>
    </Modal>
  );
};

type UseFormListProps = {
  formProps: UseFormReturnType<IPlant>["formProps"];
};

const useFormList = (props: UseFormListProps) => {
  const t = useTranslate();
  const { token } = theme.useToken();

  const formList = useMemo(() => {
    const step1 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Form.Item
          label={
            <span>
              <ShopOutlined /> {t("plants.fields.name.label")}
            </span>
          }
          name="plant_name"
          rules={[{ required: true, message: t("plants.fields.name.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plants.fields.name.placeholder")}
            prefix={<ShopOutlined style={{ color: token.colorTextTertiary }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <TagOutlined /> {t("plants.fields.type.label")}
            </span>
          }
          name="type"
          rules={[{ required: true, message: t("plants.fields.type.required") }]}
        >
          <Select
            size="large"
            placeholder={t("plants.fields.type.placeholder")}
            options={[
              { value: "Rau lá", label: "Rau lá" },
              { value: "Củ", label: "Củ" },
              { value: "Quả", label: "Quả" },
              { value: "Gia vị", label: "Gia vị" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <NumberOutlined /> {t("plants.fields.quantity.label")}
            </span>
          }
          name="quantity"
          rules={[{ required: true, message: t("plants.fields.quantity.required") }]}
        >
          <InputNumber
            size="large"
            min={0}
            style={{ width: "100%" }}
            placeholder="0"
            addonAfter={<NumberOutlined />}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <FileTextOutlined /> {t("plants.fields.description.label")}
            </span>
          }
          name="description"
        >
          <Input.TextArea
            rows={3}
            placeholder={t("plants.fields.description.placeholder")}
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <UploadOutlined /> {t("plants.fields.image.label")}
            </span>
          }
          name="image_url"
          rules={[{ required: true, message: t("plants.fields.image.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plants.fields.image.placeholder")}
            prefix={<UploadOutlined style={{ color: token.colorTextTertiary }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <TagOutlined /> {t("plants.fields.status.label")}
            </span>
          }
          name="status"
          rules={[{ required: true, message: t("plants.fields.status.required") }]}
          initialValue="Available"
        >
          <Select
            size="large"
            placeholder={t("plants.fields.status.placeholder")}
            options={[
              { value: "Available", label: "Available" },
              { value: "In-Use", label: "In-Use" },
              { value: "Maintenance", label: "Maintenance" },
            ]}
          />
        </Form.Item>
      </Space>
    );

    const step2 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Form.Item
          label={
            <span>
              <DollarOutlined /> {t("plants.fields.basePrice.label")}
            </span>
          }
          name="base_price"
          rules={[{ required: true, message: t("plants.fields.basePrice.required") }]}
        >
          <InputNumber
            size="large"
            min={0}
            style={{ width: "100%" }}
            placeholder="0"
            addonAfter="VND"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <FieldTimeOutlined /> {t("plants.fields.preservationDay.label")}
            </span>
          }
          name="preservation_day"
          rules={[{ required: true, message: t("plants.fields.preservationDay.required") }]}
        >
          <InputNumber
            size="large"
            min={1}
            style={{ width: "100%" }}
            placeholder="0"
            addonAfter={t("plants.days")}
          />
        </Form.Item>

        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <PercentageOutlined /> {t("plants.fields.deltaOne.label")}
              </span>
            }
            name="delta_one"
            rules={[{ required: true, message: t("plants.fields.deltaOne.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <PercentageOutlined /> {t("plants.fields.deltaTwo.label")}
              </span>
            }
            name="delta_two"
            rules={[{ required: true, message: t("plants.fields.deltaTwo.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
        </Flex>

        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <PercentageOutlined /> {t("plants.fields.deltaThree.label")}
              </span>
            }
            name="delta_three"
            rules={[{ required: true, message: t("plants.fields.deltaThree.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <PercentageOutlined /> {t("plants.fields.estimatedPerOne.label")}
              </span>
            }
            name="estimated_per_one"
            rules={[{ required: true, message: t("plants.fields.estimatedPerOne.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
        </Flex>
      </Space>
    );

    return [step1, step2];
  }, [t, token]);

  return { formList };
};
