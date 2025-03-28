import {
  IPlant,
  IYield,
  IFertilizer,
  IPesticide,
  IItem,
  ICaringTask,
  IHarvestingTask,
  IInspectingForm,
} from "@/interfaces";
import { useSelect } from "@refinedev/antd";
import { BaseKey, useList, useTranslate } from "@refinedev/core";
import { FormProps } from "antd";
import { useState, useMemo, useEffect } from "react";
import { PlantSelectionStep } from "../plant-selection-step";
import { YieldSelectionStep } from "../yield-selection-step";
import { DetailsStep } from "../details-step";
import { TasksStep } from "../tasks-step";
import { ReviewStep } from "../review-step";

export const useFormList = ({
  formProps,
  planId,
  canEditPlant = true,
}: {
  formProps: FormProps;
  planId?: BaseKey;
  canEditPlant?: boolean;
}) => {
  const t = useTranslate();

  const { data: plantsData, isLoading: plantsLoading } = useList<IPlant>({
    resource: "plants",
    filters: [{ field: "is_available", operator: "eq", value: true }],
    pagination: { pageSize: 100 },
  });

  const { data: yieldsData, isLoading: yieldsLoading } = useList<IYield>({
    resource: "yields",
    filters: [{ field: "is_available", operator: "eq", value: true }],
    pagination: { pageSize: 100 },
  });

  const { selectProps: fertilizerSelectProps } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: pesticideSelectProps } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: itemSelectProps } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  const [caringTasks, setCaringTasks] = useState<Partial<ICaringTask>[]>(
    formProps.initialValues?.caring_task_information || formProps.initialValues?.caringTasks || [],
  );

  const [harvestingTasks, setHarvestingTasks] = useState<Partial<IHarvestingTask>[]>(
    formProps.initialValues?.harvesting_task_information ||
      formProps.initialValues?.harvestingTasks ||
      [],
  );

  const [inspectingTasks, setInspectingTasks] = useState<Partial<IInspectingForm>[]>(
    formProps.initialValues?.inspecting_form_information ||
      formProps.initialValues?.inspectingTasks ||
      [],
  );

  useEffect(() => {
    if (formProps.initialValues) {
      setCaringTasks(
        formProps.initialValues.caring_task_information ||
          formProps.initialValues.caringTasks ||
          [],
      );

      setHarvestingTasks(
        formProps.initialValues.harvesting_task_information ||
          formProps.initialValues.harvestingTasks ||
          [],
      );

      setInspectingTasks(
        formProps.initialValues.inspecting_form_information ||
          formProps.initialValues.inspectingTasks ||
          [],
      );
    }
  }, [formProps.initialValues]);

  const formList = useMemo(
    () => [
      <PlantSelectionStep
        key="plant"
        t={t}
        plants={plantsData?.data || []}
        loading={plantsLoading}
        total={plantsData?.total || 0}
        canEdit={canEditPlant}
      />,
      <YieldSelectionStep
        key="yield"
        t={t}
        yields={yieldsData?.data || []}
        loading={yieldsLoading}
      />,
      <DetailsStep key="details" t={t} />,
      <TasksStep
        planId={planId || formProps.initialValues?.id || 1}
        key="tasks"
        fertilizerSelectProps={fertilizerSelectProps}
        pesticideSelectProps={pesticideSelectProps}
        itemSelectProps={itemSelectProps}
      />,
      <ReviewStep
        key="review"
        t={t}
        formProps={formProps}
        caringTasks={caringTasks}
        harvestingTasks={harvestingTasks}
        inspectingTasks={inspectingTasks}
        plants={plantsData?.data || []}
        yields={yieldsData?.data || []}
      />,
    ],
    [
      t,
      plantsData?.data,
      plantsLoading,
      plantsData?.total,
      yieldsData?.data,
      yieldsLoading,
      yieldsData?.total,
      caringTasks,
      harvestingTasks,
      inspectingTasks,
      fertilizerSelectProps,
      pesticideSelectProps,
      itemSelectProps,
      formProps,
      planId,
      canEditPlant,
    ],
  );

  return {
    formList,
    caringTasks,
    setCaringTasks,
    harvestingTasks,
    setHarvestingTasks,
    inspectingTasks,
    setInspectingTasks,
  };
};
