import {
  useTranslate,
  useGetToPath,
  useGo,
  useGetIdentity,
  useNotification,
} from "@refinedev/core";
import { SaveButton, useStepsForm } from "@refinedev/antd";
import { Form, Button, Steps, Flex, message } from "antd";
import { useSearchParams } from "react-router";
import { IPlan } from "../../interfaces";
import { useFormList } from "@/components/plan";
import { FileTextOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export const PlanCreate = () => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { data: identity } = useGetIdentity<{ id: number }>();
  const expert_id = identity?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { open, close } = useNotification();

  const { current, gotoStep, stepsProps, formProps, saveButtonProps, form } = useStepsForm<IPlan>({
    resource: "plans",
    action: "create",
  });

  useEffect(() => {
    if (expert_id !== undefined) {
      form.setFieldValue("expert_id", expert_id);
    }
  }, [expert_id, form]);

  const modifiedSaveButtonProps = {
    ...saveButtonProps,
    onClick: async () => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
        form.setFieldValue("expert_id", expert_id);

        if (saveButtonProps.onClick) {
          await saveButtonProps.onClick();
        }
      } catch (error) {
        console.error("Submission error:", error);
        message.error("An error occurred during submission");
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 500);
      }
    },
    loading: isSubmitting || saveButtonProps.loading,
    disabled: isSubmitting || saveButtonProps.disabled,
  };

  const { formList } = useFormList({ formProps });

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

  const handleSaveDraft = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      form.setFieldValue("expert_id", expert_id);

      if (saveButtonProps.onClick) {
        await saveButtonProps.onClick();
      }
    } catch (error) {
      console.error("Draft save error:", error);
      message.error("An error occurred while saving draft");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>{t("plans.actions.create", "Plan Create")}</h2>

      <Steps {...stepsProps} responsive style={{ marginBottom: "24px" }}>
        <Steps.Step title={t("plans.steps.plant", "Plant")} />
        <Steps.Step title={t("plans.steps.yield", "Yield")} />
        <Steps.Step title={t("plans.steps.details", "Details")} />
        <Steps.Step title={t("plans.steps.tasks", "Task")} />
        <Steps.Step title={t("plans.steps.review", "Review")} />
      </Steps>

      <Form {...formProps} layout="vertical">
        {/* Hidden field for expert_id */}
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
            Draft
          </SaveButton>
          <Button disabled={isFirstStep || isSubmitting} onClick={() => gotoStep(current - 1)}>
            {t("buttons.previousStep")}
          </Button>
          {isLastStep ? (
            <SaveButton {...modifiedSaveButtonProps} />
          ) : (
            <Button type="primary" onClick={() => gotoStep(current + 1)} disabled={isSubmitting}>
              {t("buttons.nextStep")}
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
