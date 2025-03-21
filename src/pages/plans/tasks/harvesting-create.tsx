import { useParams } from "react-router";
import { HarvestingTaskForm } from "@/components/harvesting-task/drawer-form";

export const HarvestingCreate = () => {
  const { taskId } = useParams();
  return <HarvestingTaskForm action={"create"} />;
};
