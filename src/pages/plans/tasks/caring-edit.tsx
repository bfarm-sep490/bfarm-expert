import { useParams } from "react-router";
import { CaringTaskPage } from "../../../components/caring-task/drawer-form";

export const CaringEdit = () => {
  const { taskId } = useParams();
  return <CaringTaskPage action={"edit"} />;
};
