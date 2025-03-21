import { useParams } from "react-router";
import PackagingTaskForm from "@/components/packaging-task/drawer-form";

export const PackagingUpdate = () => {
  const { taskId } = useParams();
  return <PackagingTaskForm action={"edit"} />;
};
