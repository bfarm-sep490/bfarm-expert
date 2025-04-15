import { PlanDrawer } from "@/components/plan/drawer-form";
import { useGetToPath, useGo } from "@refinedev/core";

import { useSearchParams } from "react-router";

export const PlanCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  return (
    <PlanDrawer
      action="create"
      onMutationSuccess={() => {
        go({
          to:
            searchParams.get("to") ??
            getToPath({
              action: "list",
            }) ??
            "",
          query: {
            to: undefined,
          },
          options: {
            keepQuery: true,
          },
          type: "replace",
        });
      }}
    />
  );
};
