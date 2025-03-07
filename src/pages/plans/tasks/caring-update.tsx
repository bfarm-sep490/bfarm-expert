import { useParams } from "react-router";
import { CaringTaskPage } from "../../../components/caring-task/drawer-form";

export const CaringUpdate = () => {
  return <CaringTaskPage action={"edit"} />;
};
