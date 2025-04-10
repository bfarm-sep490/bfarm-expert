import { useParams } from "react-router";
import { InspectionListTable } from "@/components/inspection";

export const InspectingTaskList = () => {
  const { taskId } = useParams();
  return <InspectionListTable />;
};
