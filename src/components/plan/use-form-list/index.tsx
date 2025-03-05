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
import { useList, useTranslate } from "@refinedev/core";
import { FormProps } from "antd";
import { useState, useMemo, useEffect } from "react";
import { PlantSelectionStep } from "../plant-selection-step";
import { YieldSelectionStep } from "../yield-selection-step";
import { DetailsStep } from "../details-step";
import { TasksStep } from "../tasks-step";
import { ReviewStep } from "../review-step";
export const useFormList = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const { data: plantsData, isLoading: plantsLoading } = useList<IPlant>({
    resource: "plants",
    filters: [{ field: "is_available", operator: "eq", value: true }],
    pagination: {
      pageSize: 6,
    },
  });

  const { data: yieldsData, isLoading: yieldsLoading } = useList<IYield>({
    resource: "yields",
    filters: [{ field: "is_available", operator: "eq", value: true }],
    pagination: {
      pageSize: 6,
    },
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

  // Tasks state
  const [caringTasks, setCaringTasks] = useState<Partial<ICaringTask>[]>([]);
  const [harvestingTasks, setHarvestingTasks] = useState<Partial<IHarvestingTask>[]>([]);
  const [inspectingTasks, setInspectingTasks] = useState<Partial<IInspectingForm>[]>([]);

  // Form steps
  const formList = useMemo(
    () => [
      // Step 1: Plant Selection
      <PlantSelectionStep
        key="plant"
        t={t}
        plants={plantsData?.data || []}
        loading={plantsLoading}
        total={plantsData?.total || 0}
      />,

      // Step 2: Yield Selection
      <YieldSelectionStep
        key="yield"
        t={t}
        yields={yieldsData?.data || []}
        loading={yieldsLoading}
        total={yieldsData?.total || 0}
      />,

      // Step 3: Basic Details
      <DetailsStep key="details" t={t} />,

      // Step 4: Task Management
      <TasksStep
        planId={1}
        key="tasks"
        fertilizerSelectProps={fertilizerSelectProps}
        pesticideSelectProps={pesticideSelectProps}
        itemSelectProps={itemSelectProps}
      />,

      // Step 5: Review
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
