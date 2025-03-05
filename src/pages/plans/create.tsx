import { useTranslate, useGetToPath, useGo } from "@refinedev/core";
import { SaveButton, useStepsForm } from "@refinedev/antd";
import { Form, Button, Steps, Flex } from "antd";
import { useSearchParams } from "react-router";
import { IPlan } from "../../interfaces";
import { useFormList } from "@/components/plan";

export const PlanCreate = () => {
  const t = useTranslate();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  const { current, gotoStep, stepsProps, formProps, saveButtonProps } = useStepsForm<IPlan>({
    resource: "plans",
    action: "create",
  });

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
        {formList[current]}
      </Form>

      <Flex align="center" justify="space-between" style={{ marginTop: "24px" }}>
        <Button onClick={handleCancel}>{t("buttons.cancel")}</Button>
        <Flex align="center" gap={16}>
          <Button disabled={isFirstStep} onClick={() => gotoStep(current - 1)}>
            {t("buttons.previousStep")}
          </Button>
          {isLastStep ? (
            <SaveButton icon={false} {...saveButtonProps} />
          ) : (
            <Button type="primary" onClick={() => gotoStep(current + 1)}>
              {t("buttons.nextStep")}
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
