import {
  useTranslate,
  useGetToPath,
  useGo,
  useGetIdentity,
  useSelect,
  useList,
} from "@refinedev/core";
import { SaveButton, useStepsForm } from "@refinedev/antd";
import { Button, Steps, Flex, Drawer, Spin, theme, Form } from "antd";
import {
  InfoCircleOutlined,
  ToolOutlined,
  CheckOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { useState, useEffect } from "react";
import {
  IPlan,
  IPlant,
  IYield,
  Template,
  IFertilizer,
  IPesticide,
  IItem,
  IPackagingType,
} from "@/interfaces";
import dayjs from "dayjs";
import { useOrderStore } from "@/store/order-store";
import { PlanTypeSelection } from "./plan-type-selection";
import { TemplateTypeSelection } from "./template-type-selection";
import { TemplateSelection } from "../template-selection";
import { BasicInformation } from "./basic-information";
import { TasksSection } from "./tasks-section";
import { ReviewSection } from "./review-section";
import { PlanType, TemplateType } from "./types";

type Props = {
  action: "create";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PlanDrawer = (props: Props) => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const go = useGo();
  const { token } = theme.useToken();
  const { data: identity } = useGetIdentity<{ id: number; name: string }>();
  const expert_id = identity?.id;
  const expert_name = identity?.name;
  const [planType, setPlanType] = useState<PlanType>("order");
  const [templateType, setTemplateType] = useState<TemplateType>("without-template");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPlanSelectionModalVisible, setIsPlanSelectionModalVisible] = useState(true);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isTemplateSelectionVisible, setIsTemplateSelectionVisible] = useState(false);

  const { selectedOrders, clearOrders } = useOrderStore();

  // Add useSelect hooks for plants and yields
  const { options: plantsOptions } = useSelect<IPlant>({
    resource: "plants",
    optionLabel: "plant_name",
    optionValue: "id",
  });

  const { options: yieldsOptions } = useSelect<IYield>({
    resource: "yields",
    optionLabel: "yield_name",
    optionValue: "id",
  });

  const { options: fertilizersOptions } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: pesticidesOptions } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: itemsOptions } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: packagingTypesOptions } = useSelect<IPackagingType>({
    resource: "packaging-types",
    optionLabel: "name",
    optionValue: "id",
  });

  const handlePlanSelection = (type: PlanType) => {
    setPlanType(type);
    setIsPlanSelectionModalVisible(false);
    setIsTemplateModalVisible(true);
    go({
      to: `${getToPath({
        action: "create",
      })}`,
      type: "replace",
      options: {
        keepQuery: true,
      },
    });
  };

  const handleTemplateSelection = (type: TemplateType) => {
    setTemplateType(type);
    setIsTemplateModalVisible(false);
    if (type === "with-template") {
      setIsTemplateSelectionVisible(true);
    } else {
      setIsDrawerVisible(true);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsTemplateSelectionVisible(false);
    setIsDrawerVisible(true);
    // Apply template data to form
    formProps.form?.setFieldsValue({
      caring_tasks: template.caring_tasks,
      harvesting_tasks: template.harvesting_tasks,
      inspecting_forms: template.inspecting_forms,
      packaging_tasks: template.packaging_tasks,
    });
  };

  const { current, gotoStep, stepsProps, formProps, saveButtonProps, formLoading } =
    useStepsForm<IPlan>({
      resource: "plans/with-details",
      action: props?.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
      defaultFormValues: {
        expert_id: expert_id as number,
        created_by: expert_name as string,
        caring_tasks: [],
        harvesting_tasks: [],
        inspecting_forms: [],
        packaging_tasks: [],
        order_ids: selectedOrders.map((order) => order.id),
      },
      successNotification: {
        message: "Kế hoạch đã được tạo thành công",
        type: "success",
      },
    });

  // Cập nhật order_ids khi selectedOrders thay đổi
  useEffect(() => {
    if (formProps.form) {
      formProps.form.setFieldsValue({
        order_ids: selectedOrders.map((order) => order.id),
      });
    }
  }, [selectedOrders, formProps.form]);

  // Tự động điền thông tin từ orders khi không có template
  useEffect(() => {
    if (formProps.form && selectedOrders.length > 0 && !selectedTemplate) {
      // Lấy thông tin từ order đầu tiên
      const firstOrder = selectedOrders[0];

      // Tính tổng quantity từ tất cả orders
      const totalQuantity = selectedOrders.reduce((sum, order) => sum + order.quantity, 0);

      // Cập nhật form với thông tin từ orders
      formProps.form.setFieldsValue({
        plant_id: firstOrder.plant_id,
        estimated_product: totalQuantity,
        // Các trường khác có thể thêm vào tùy theo yêu cầu
      });
    }
  }, [selectedOrders, selectedTemplate, formProps.form]);

  // Update form values when template is selected
  useEffect(() => {
    if (selectedTemplate && formProps.form) {
      const { expert_id: _, created_by: __, ...templateData } = selectedTemplate;

      // Convert date strings to dayjs objects
      const formattedTemplateData = {
        ...templateData,
        plan_name: `${templateData.name}`,
        start_date: templateData.start_date ? dayjs(templateData.start_date) : undefined,
        end_date: templateData.end_date ? dayjs(templateData.end_date) : undefined,
        caring_tasks: templateData.caring_tasks?.map((task) => ({
          ...task,
          start_date: task.start_date ? dayjs(task.start_date) : undefined,
          end_date: task.end_date ? dayjs(task.end_date) : undefined,
        })),
        harvesting_tasks: templateData.harvesting_tasks?.map((task) => ({
          ...task,
          start_date: task.start_date ? dayjs(task.start_date) : undefined,
          end_date: task.end_date ? dayjs(task.end_date) : undefined,
        })),
        inspecting_forms: templateData.inspecting_forms?.map((form) => ({
          ...form,
          start_date: form.start_date ? dayjs(form.start_date) : undefined,
          end_date: form.end_date ? dayjs(form.end_date) : undefined,
        })),
        packaging_tasks: templateData.packaging_tasks?.map((task) => ({
          ...task,
          start_date: task.start_date ? dayjs(task.start_date) : undefined,
          end_date: task.end_date ? dayjs(task.end_date) : undefined,
        })),
      };

      formProps.form.setFieldsValue(formattedTemplateData);
    }
  }, [selectedTemplate, formProps.form]);

  // Initialize form with default values
  useEffect(() => {
    if (formProps.form) {
      formProps.form.setFieldsValue({
        expert_id: expert_id as number,
        created_by: expert_name as string,
        start_date: dayjs(),
        end_date: dayjs(),
      });
    }
  }, [formProps.form, expert_id, expert_name]);

  const onDrawerClose = () => {
    clearOrders();
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        getToPath({
          action: "list",
        }) ?? "",
      type: "replace",
      options: {
        keepQuery: true,
      },
    });
  };

  const isLastStep = current === 2;
  const isFirstStep = current === 0;

  const renderFormContent = () => {
    switch (current) {
      case 0:
        return (
          <BasicInformation
            formProps={formProps}
            selectedTemplate={selectedTemplate}
            plantsOptions={plantsOptions}
            isPlantFromOrder={selectedOrders.length > 0}
          />
        );
      case 1:
        return (
          <TasksSection
            formProps={formProps}
            selectedTemplate={selectedTemplate}
            yieldsOptions={yieldsOptions}
            fertilizersOptions={fertilizersOptions}
            pesticidesOptions={pesticidesOptions}
            itemsOptions={itemsOptions}
            packagingTypesOptions={packagingTypesOptions}
            identity={identity}
            orders={selectedOrders}
          />
        );
      case 2:
        return (
          <ReviewSection
            formProps={formProps}
            selectedTemplate={selectedTemplate}
            plantsOptions={plantsOptions}
            yieldsOptions={yieldsOptions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PlanTypeSelection
        open={isPlanSelectionModalVisible}
        onClose={onDrawerClose}
        onPlanTypeSelect={handlePlanSelection}
      />

      <TemplateTypeSelection
        open={isTemplateModalVisible}
        onClose={onDrawerClose}
        onTemplateTypeSelect={handleTemplateSelection}
      />

      <TemplateSelection
        open={isTemplateSelectionVisible}
        onClose={() => setIsTemplateSelectionVisible(false)}
        onTemplateSelect={handleTemplateSelect}
      />

      <Drawer
        open={isDrawerVisible}
        title="Tạo kế hoạch"
        width="100%"
        styles={{
          header: { padding: "16px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` },
          footer: { padding: "16px 24px", borderTop: `1px solid ${token.colorBorderSecondary}` },
          content: { padding: 0, background: token.colorBgContainer },
        }}
        closable={false}
        footer={
          <Flex align="center" justify="space-between">
            <Button size="large" onClick={onDrawerClose}>
              {t("buttons.cancel")}
            </Button>
            <Flex align="center" gap={16}>
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
          </Flex>
        }
      >
        <Spin spinning={formLoading}>
          <Flex vertical gap="large" style={{ padding: "24px" }}>
            <Steps
              className="site-navigation-steps"
              {...stepsProps}
              responsive
              current={current}
              style={{ marginBottom: "24px" }}
            >
              <Steps.Step title={t("plans.steps.basic")} icon={<InfoCircleOutlined />} />
              <Steps.Step title={t("plans.steps.tasks")} icon={<ToolOutlined />} />
              <Steps.Step title={t("plans.steps.review")} icon={<CheckOutlined />} />
            </Steps>

            <Form {...formProps} layout="vertical">
              {renderFormContent()}
            </Form>
          </Flex>
        </Spin>
      </Drawer>
    </>
  );
};
