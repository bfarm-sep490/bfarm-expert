import { useEffect, useRef, useState } from "react";
import { useNavigation, useTranslate } from "@refinedev/core";
import { DeleteButton, ListButton, SaveButton, useForm } from "@refinedev/antd";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  InputRef,
  Row,
  Switch,
} from "antd";
import type { IPlant } from "../../interfaces";
import { FormItemHorizontal } from "../../components"; // Assuming you have this component
import { EditOutlined, LeftOutlined, RightCircleOutlined, ShopOutlined } from "@ant-design/icons";

export const PlantEdit = () => {
  const titleInputRef = useRef<InputRef>(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const t = useTranslate();
  const { list } = useNavigation();

  const { formProps, query: queryResult, saveButtonProps } = useForm<IPlant>();
  const plant = queryResult?.data?.data;

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  return (
    <>
      <Flex>
        <ListButton icon={<LeftOutlined />}>{t("plants.plants")}</ListButton>
      </Flex>
      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
            <Flex align="center" gap={24}>
              <Form.Item
                name="plant_name"
                style={{ width: "100%", marginBottom: "0" }}
                rules={[{ required: true }]}
              >
                <Input
                  ref={titleInputRef}
                  size="large"
                  placeholder={t("plants.fields.name.placeholder")}
                />
              </Form.Item>
            </Flex>
            <Card style={{ marginTop: "16px" }} styles={{ body: { padding: 0 } }}>
              <FormItemHorizontal
                isInput={false}
                icon={<RightCircleOutlined />}
                label={t("plants.fields.status.label")}
                flexProps={{ style: { padding: "24px 16px" } }}
              >
                <Switch checked={plant?.is_available} disabled={isFormDisabled} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="quantity"
                icon={<ShopOutlined />}
                label={t("plants.fields.quantity.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="unit"
                icon={<ShopOutlined />}
                label={t("plants.fields.unit.label")}
                rules={[{ required: true }]}
              >
                <Input />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="description"
                icon={<ShopOutlined />}
                label={t("plants.fields.description.label")}
                flexProps={{ align: "flex-start" }}
              >
                <Input.TextArea rows={2} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="min_temp"
                icon={<ShopOutlined />}
                label={t("plants.fields.minTemp.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="max_temp"
                icon={<ShopOutlined />}
                label={t("plants.fields.maxTemp.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="min_humid"
                icon={<ShopOutlined />}
                label={t("plants.fields.minHumid.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="max_humid"
                icon={<ShopOutlined />}
                label={t("plants.fields.maxHumid.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="min_moisture"
                icon={<ShopOutlined />}
                label={t("plants.fields.minMoisture.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="max_moisture"
                icon={<ShopOutlined />}
                label={t("plants.fields.maxMoisture.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="min_fertilizer_quantity"
                icon={<ShopOutlined />}
                label={t("plants.fields.minFertilizer.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="max_fertilizer_quantity"
                icon={<ShopOutlined />}
                label={t("plants.fields.maxFertilizer.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="fertilizer_unit"
                icon={<ShopOutlined />}
                label={t("plants.fields.fertilizerUnit.label")}
                rules={[{ required: true }]}
              >
                <Input />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="min_pesticide_quantity"
                icon={<ShopOutlined />}
                label={t("plants.fields.minPesticide.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="max_pesticide_quantity"
                icon={<ShopOutlined />}
                label={t("plants.fields.maxPesticide.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="pesticide_unit"
                icon={<ShopOutlined />}
                label={t("plants.fields.pesticideUnit.label")}
                rules={[{ required: true }]}
              >
                <Input />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="min_brix_point"
                icon={<ShopOutlined />}
                label={t("plants.fields.minBrix.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="max_brix_point"
                icon={<ShopOutlined />}
                label={t("plants.fields.maxBrix.label")}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </FormItemHorizontal>
              <Divider style={{ margin: "0" }} />
              <FormItemHorizontal
                name="gt_test_kit_color"
                icon={<ShopOutlined />}
                label={t("plants.fields.testKitColor.label")}
                rules={[{ required: true }]}
              >
                <Input />
              </FormItemHorizontal>
            </Card>
            <Flex align="center" justify="space-between" style={{ padding: "16px" }}>
              {isFormDisabled ? (
                <>
                  <DeleteButton
                    type="text"
                    onSuccess={() => list("plants")}
                    style={{ marginLeft: "-16px" }}
                  />
                  <Button
                    style={{ marginLeft: "auto" }}
                    icon={<EditOutlined />}
                    onClick={() => setIsFormDisabled(false)}
                  >
                    {t("actions.edit")}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsFormDisabled(true)}>{t("actions.cancel")}</Button>
                  <SaveButton
                    {...saveButtonProps}
                    disabled={isFormDisabled}
                    style={{ marginLeft: "auto" }}
                    htmlType="submit"
                    type="primary"
                    icon={null}
                  >
                    Save
                  </SaveButton>
                </>
              )}
            </Flex>
          </Form>
        </Col>
        <Col span={12}>
          {/* Add any additional information or review component here if needed */}
        </Col>
      </Row>
    </>
  );
};
