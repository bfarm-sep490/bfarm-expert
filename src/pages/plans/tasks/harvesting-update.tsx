import { useParams } from "react-router";
import { HarvestingTaskForm } from "@/components/harvesting-task/drawer-form";

export const HarvestingUpdate = () => {
  const { taskId } = useParams();
  return <HarvestingTaskForm action={"edit"} />;
};
