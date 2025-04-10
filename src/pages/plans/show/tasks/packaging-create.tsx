import { useParams } from "react-router";
import PackagingTaskForm from "@/components/packaging-task/drawer-form";

export const PackagingCreate = () => {
  const { taskId } = useParams();
  return <PackagingTaskForm action={"create"} />;
};
