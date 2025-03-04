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
  Switch,
  InputNumber,
  Card,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  ShopOutlined,
  NumberOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  FireOutlined,
  CloudOutlined,
  ExperimentOutlined,
  BgColorsOutlined,
  AimOutlined,
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
          <Steps.Step title={t("plants.steps.environment")} icon={<EnvironmentOutlined />} />
          <Steps.Step title={t("plants.steps.treatment")} icon={<MedicineBoxOutlined />} />
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
              <FileTextOutlined /> {t("plants.fields.unit.label")}
            </span>
          }
          name="unit"
          rules={[{ required: true, message: t("plants.fields.unit.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plants.fields.unit.placeholder")}
            prefix={<FileTextOutlined style={{ color: token.colorTextTertiary }} />}
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
              <CheckCircleOutlined /> {t("plants.fields.isAvailable.label")}
            </span>
          }
          name="is_available"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      </Space>
    );

    const step2 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <FireOutlined /> {t("plants.fields.minTemp.label")}
              </span>
            }
            name="min_temp"
            rules={[{ required: true, message: t("plants.fields.minTemp.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              style={{ width: "100%" }}
              addonAfter="°C"
              placeholder="0"
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <FireOutlined /> {t("plants.fields.maxTemp.label")}
              </span>
            }
            name="max_temp"
            rules={[{ required: true, message: t("plants.fields.maxTemp.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              style={{ width: "100%" }}
              addonAfter="°C"
              placeholder="0"
            />
          </Form.Item>
        </Flex>
        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <CloudOutlined /> {t("plants.fields.minHumid.label")}
              </span>
            }
            name="min_humid"
            rules={[{ required: true, message: t("plants.fields.minHumid.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              max={100}
              style={{ width: "100%" }}
              addonAfter="%"
              placeholder="0"
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <CloudOutlined /> {t("plants.fields.maxHumid.label")}
              </span>
            }
            name="max_humid"
            rules={[{ required: true, message: t("plants.fields.maxHumid.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              max={100}
              style={{ width: "100%" }}
              addonAfter="%"
              placeholder="0"
            />
          </Form.Item>
        </Flex>
        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <AimOutlined /> {t("plants.fields.minMoisture.label")}
              </span>
            }
            name="min_moisture"
            rules={[{ required: true, message: t("plants.fields.minMoisture.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              max={100}
              style={{ width: "100%" }}
              addonAfter="%"
              placeholder="0"
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <AimOutlined /> {t("plants.fields.maxMoisture.label")}
              </span>
            }
            name="max_moisture"
            rules={[{ required: true, message: t("plants.fields.maxMoisture.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              size="large"
              min={0}
              max={100}
              style={{ width: "100%" }}
              addonAfter="%"
              placeholder="0"
            />
          </Form.Item>
        </Flex>
      </Space>
    );

    const step3 = (
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <ExperimentOutlined /> {t("plants.fields.minFertilizer.label")}
              </span>
            }
            name="min_fertilizer_quantity"
            rules={[{ required: true, message: t("plants.fields.minFertilizer.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <ExperimentOutlined /> {t("plants.fields.maxFertilizer.label")}
              </span>
            }
            name="max_fertilizer_quantity"
            rules={[{ required: true, message: t("plants.fields.maxFertilizer.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
        </Flex>
        <Form.Item
          label={
            <span>
              <FileTextOutlined /> {t("plants.fields.fertilizerUnit.label")}
            </span>
          }
          name="fertilizer_unit"
          rules={[{ required: true, message: t("plants.fields.fertilizerUnit.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plants.fields.fertilizerUnit.placeholder")}
            prefix={<FileTextOutlined style={{ color: token.colorTextTertiary }} />}
          />
        </Form.Item>
        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <MedicineBoxOutlined /> {t("plants.fields.minPesticide.label")}
              </span>
            }
            name="min_pesticide_quantity"
            rules={[{ required: true, message: t("plants.fields.minPesticide.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <MedicineBoxOutlined /> {t("plants.fields.maxPesticide.label")}
              </span>
            }
            name="max_pesticide_quantity"
            rules={[{ required: true, message: t("plants.fields.maxPesticide.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
        </Flex>
        <Form.Item
          label={
            <span>
              <FileTextOutlined /> {t("plants.fields.pesticideUnit.label")}
            </span>
          }
          name="pesticide_unit"
          rules={[{ required: true, message: t("plants.fields.pesticideUnit.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plants.fields.pesticideUnit.placeholder")}
            prefix={<FileTextOutlined style={{ color: token.colorTextTertiary }} />}
          />
        </Form.Item>
        <Flex gap="middle">
          <Form.Item
            label={
              <span>
                <ExperimentOutlined /> {t("plants.fields.minBrix.label")}
              </span>
            }
            name="min_brix_point"
            rules={[{ required: true, message: t("plants.fields.minBrix.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <ExperimentOutlined /> {t("plants.fields.maxBrix.label")}
              </span>
            }
            name="max_brix_point"
            rules={[{ required: true, message: t("plants.fields.maxBrix.required") }]}
            style={{ flex: 1 }}
          >
            <InputNumber size="large" min={0} style={{ width: "100%" }} placeholder="0" />
          </Form.Item>
        </Flex>
        <Form.Item
          label={
            <span>
              <BgColorsOutlined /> {t("plants.fields.testKitColor.label")}
            </span>
          }
          name="gt_test_kit_color"
          rules={[{ required: true, message: t("plants.fields.testKitColor.required") }]}
        >
          <Input
            size="large"
            placeholder={t("plants.fields.testKitColor.placeholder")}
            prefix={<BgColorsOutlined style={{ color: token.colorTextTertiary }} />}
          />
        </Form.Item>
      </Space>
    );

    return [step1, step2, step3];
  }, [props.formProps]);

  return { formList };
};
