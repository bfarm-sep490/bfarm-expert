import { IPlan, ICaringTask, IHarvestingTask, IInspectingForm } from "@/interfaces";
import { useCreate, useUpdate } from "@refinedev/core";

export const usePlanDraftService = () => {
  const { mutateAsync: createPlan } = useCreate<IPlan>();
  const { mutateAsync: updatePlan } = useUpdate<IPlan>();
  const { mutateAsync: createCaringTask } = useCreate<ICaringTask>();
  const { mutateAsync: createHarvestingTask } = useCreate<IHarvestingTask>();
  const { mutateAsync: createInspectingTask } = useCreate<IInspectingForm>();

  const createDraftPlan = async (plantId: number) => {
    const draftPlan = await createPlan({
      resource: "plans",
      values: {
        plant_id: plantId,
        yield_id: null,
        expert_id: null,
        plan_name: "Draft Plan",
        description: "",
        started_date: null,
        ended_date: null,
        status: "Draft",
        estimated_product: 0,
        estimated_unit: "",
        created_by: "system",
        created_at: new Date().toISOString(),
      },
    });

    return draftPlan.data;
  };

  const updateDraftPlan = async (planId: number, values: Partial<IPlan>) => {
    const updatedPlan = await updatePlan({
      resource: "plans",
      id: planId,
      values: {
        ...values,
        updated_at: new Date().toISOString(),
      },
    });

    return updatedPlan.data;
  };

  const saveCaringTasks = async (planId: number, tasks: Partial<ICaringTask>[]) => {
    const savedTasks = await Promise.all(
      tasks.map((task) =>
        createCaringTask({
          resource: "caring-tasks",
          values: {
            ...task,
            plan_id: planId,
            status: "Draft",
          },
        }),
      ),
    );

    return savedTasks.map((response) => response.data);
  };

  const saveHarvestingTasks = async (planId: number, tasks: Partial<IHarvestingTask>[]) => {
    const savedTasks = await Promise.all(
      tasks.map((task) =>
        createHarvestingTask({
          resource: "harvesting-tasks",
          values: {
            ...task,
            plan_id: planId,
            status: "Draft",
          },
        }),
      ),
    );

    return savedTasks.map((response) => response.data);
  };

  const saveInspectingTasks = async (planId: number, tasks: Partial<IInspectingForm>[]) => {
    const savedTasks = await Promise.all(
      tasks.map((task) =>
        createInspectingTask({
          resource: "inspecting-forms",
          values: {
            ...task,
            plan_id: planId,
          },
        }),
      ),
    );

    return savedTasks.map((response) => response.data);
  };

  const finalizePlan = async (planId: number) => {
    const finalizedPlan = await updatePlan({
      resource: "plans",
      id: planId,
      values: {
        status: "Pending",
        updated_at: new Date().toISOString(),
      },
    });

    return finalizedPlan.data;
  };

  return {
    createDraftPlan,
    updateDraftPlan,
    saveCaringTasks,
    saveHarvestingTasks,
    saveInspectingTasks,
    finalizePlan,
  };
};
