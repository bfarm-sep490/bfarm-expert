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

export const useFormList = ({ formProps, planId }: { formProps: FormProps; planId?: BaseKey }) => {
  const t = useTranslate();

  const { data: plantsData, isLoading: plantsLoading } = useList<IPlant>({
    resource: "plants",
    filters: [{ field: "is_available", operator: "eq", value: true }],
    pagination: { pageSize: 6 },
  });

  const { data: yieldsData, isLoading: yieldsLoading } = useList<IYield>({
    resource: "yields",
    filters: [{ field: "is_available", operator: "eq", value: true }],
    pagination: { pageSize: 6 },
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
    formProps.initialValues?.caringTasks || [],
  );
  const [harvestingTasks, setHarvestingTasks] = useState<Partial<IHarvestingTask>[]>(
    formProps.initialValues?.harvestingTasks || [],
  );
  const [inspectingTasks, setInspectingTasks] = useState<Partial<IInspectingForm>[]>(
    formProps.initialValues?.inspectingTasks || [],
  );

  useEffect(() => {
    if (formProps.initialValues) {
      setCaringTasks(formProps.initialValues.caringTasks || []);
      setHarvestingTasks(formProps.initialValues.harvestingTasks || []);
      setInspectingTasks(formProps.initialValues.inspectingTasks || []);
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
      />,
      <YieldSelectionStep
        key="yield"
        t={t}
        yields={yieldsData?.data || []}
        loading={yieldsLoading}
        total={yieldsData?.total || 0}
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
      />,
    ],
    [
      t,
      plantsData,
      plantsLoading,
      yieldsData,
      yieldsLoading,
      caringTasks,
      harvestingTasks,
      inspectingTasks,
      fertilizerSelectProps,
      pesticideSelectProps,
      itemSelectProps,
      formProps,
      planId,
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
