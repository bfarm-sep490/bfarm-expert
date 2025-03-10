import { useTranslate, useGetToPath, useGo, useGetIdentity, BaseKey } from "@refinedev/core";
import { SaveButton, useStepsForm } from "@refinedev/antd";
import { Form, Button, Steps, Flex, message } from "antd";
import { useSearchParams } from "react-router";
import { useFormList } from "@/components/plan";
import { FileTextOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IPlan } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onMutationSuccess?: () => void;
};

export const PlanForm = (props: Props) => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { data: identity } = useGetIdentity<{ id: number }>();
  const expert_id = identity?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planId, setPlanId] = useState<BaseKey | undefined>(props.id);

  const { current, gotoStep, stepsProps, formProps, saveButtonProps, form, submit } =
    useStepsForm<IPlan>({
      resource: "plans",
      id: planId || props?.id,
      action: planId ? "edit" : props.action,
      redirect: false,
      queryOptions: {
        select: (rawData) => {
          const { data } = rawData;
          return {
            data: {
              ...data,
              plant_id: data.plant_information?.plant_id ?? 0,
              yield_id: data.yield_information?.yield_id ?? 0,
            },
          };
        },
      },
      onMutationSuccess: (data) => {
        const newPlanId = data?.data?.id;
        if (newPlanId && !planId) {
          setPlanId(newPlanId);
          gotoStep(3);
          message.success(t("plans.messages.createSuccess", "Plan created successfully"));
        } else if (props.action === "edit" || planId) {
          message.success(t("plans.messages.updateSuccess", "Plan updated successfully"));
        }
      },
      onMutationError: (error) => {
        console.error("Mutation error:", error);
        message.error(t("plans.messages.createError", "Failed to create plan"));
      },
    });

  useEffect(() => {
    if (expert_id !== undefined) {
      form.setFieldValue("expert_id", expert_id);
    }
  }, [expert_id, form]);

  const { formList } = useFormList({ formProps, planId });

  const handleCancel = () => {
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const isLastStep = current === formList.length - 1;
  const isFirstStep = current === 0;
  const isThirdStep = current === 2;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      form.setFieldValue("expert_id", expert_id);
      await submit();
      if (props.action === "edit" || planId) {
        gotoStep(current + 1);
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error(t("plans.messages.createError", "Failed to create plan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      form.setFieldValue("expert_id", expert_id);
      if (saveButtonProps.onClick) {
        await saveButtonProps.onClick();
      }
      message.success(t("plans.messages.draftSuccess", "Draft saved successfully"));
      go({
        to: getToPath({ action: "list" }) ?? "",
        type: "replace",
      });
    } catch (error) {
      console.error("Draft save error:", error);
      message.error(t("plans.messages.draftError", "Failed to save draft"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (isThirdStep && (!props.action || props.action === "create") && !planId) {
      handleSubmit();
    } else {
      gotoStep(current + 1);
    }
  };

  const title = props.action === "edit" || planId ? t("actions.edit") : t("actions.create");

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>{title}</h2>

      <Steps {...stepsProps} responsive style={{ marginBottom: "24px" }}>
        <Steps.Step title={t("plans.steps.plant", "Plant")} />
        <Steps.Step title={t("plans.steps.yield", "Yield")} />
        <Steps.Step title={t("plans.steps.details", "Details")} />
        <Steps.Step title={t("plans.steps.tasks", "Task")} />
        <Steps.Step title={t("plans.steps.review", "Review")} />
      </Steps>

      <Form {...formProps} layout="vertical">
        <Form.Item name="expert_id" hidden>
          <input />
        </Form.Item>
        {formList[current]}
      </Form>

      <Flex align="center" justify="space-between" style={{ marginTop: "24px" }}>
        <Button onClick={handleCancel}>{t("buttons.cancel")}</Button>
        <Flex align="center" gap={16}>
          <SaveButton
            icon={<FileTextOutlined />}
            type="dashed"
            onClick={handleSaveDraft}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("buttons.draft", "Draft")}
          </SaveButton>
          <Button disabled={isFirstStep || isSubmitting} onClick={() => gotoStep(current - 1)}>
            {t("buttons.previousStep")}
          </Button>
          {isLastStep ? (
            <SaveButton {...saveButtonProps} loading={isSubmitting} disabled={isSubmitting} />
          ) : (
            <Button
              type="primary"
              onClick={handleNextStep}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("buttons.nextStep")}
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
