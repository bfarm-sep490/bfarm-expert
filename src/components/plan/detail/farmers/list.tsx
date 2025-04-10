import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { DateField, FilterDropdown, TextField, useTable } from "@refinedev/antd";

import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  TableProps,
  Typography,
  theme,
} from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router";
import { IFarmer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
type FarmerListTableInPlanProps = {
  tableProps: TableProps;
};
export const FarmerListTableInPlan: React.FC<FarmerListTableInPlanProps> = ({ tableProps }) => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const { id } = useParams();

  return <div></div>;
};
