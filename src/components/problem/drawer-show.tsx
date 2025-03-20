import {
  DateField,
  TagField,
  TextField,
  Title,
  useModalForm,
} from "@refinedev/antd";
import { useShow, useNavigation, useBack, useUpdate } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ReportProblemModal } from "./report-modals";
import { ProblemStatusTag } from "./status-tag";
import { ProblemTypeTag } from "./type-tag";
import { TableProps } from "antd/lib";

export const ProblemShowInProblem = () => {
  const { id } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "problems",
    id,
  });
  const [open, setOpen] = useState(true);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data } = queryResult;
  const task = data?.data;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultReportStatus, setDefaultReportStatus] = useState("Resovled");
  return (
    <>
      <Drawer
        open={open}
        width={breakpoint.sm ? "736px" : "100%"}
        onClose={back}
        title={
          <>
            <Flex justify="space-between">
              <TextField value="Chi tiết vấn đề" />

              <Space>
                {task?.status === "Pending" && (
                  <>
                    {" "}
                    <Button
                      color="danger"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Cancelled");
                        setIsModalOpen(true);
                      }}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      color="primary"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Resolved");
                        setIsModalOpen(true);
                      }}
                    >
                      Đồng ý
                    </Button>
                  </>
                )}
              </Space>
            </Flex>
          </>
        }
      >
        <Flex vertical gap={24} style={{ padding: "32px" }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            <strong>#{task?.id}</strong> - {task?.problem_name}
          </Typography.Title>

          <Image.PreviewGroup items={task?.problem_images?.map((x: any) => x?.url) || []}>
            <Image
              loading="lazy"
              style={{ borderRadius: "10px" }}
              src={task?.problem_images?.[0]?.url}
            />
          </Image.PreviewGroup>
          <Divider />

          <Typography.Title level={4}>Kết quả</Typography.Title>
          {task?.result_content && task?.status === "Resolved" ? (
            <Flex vertical gap={16}>
              <List
                bordered
                dataSource={[
                  {
                    label: "Nội dung",
                    value: (
                      <Typography.Paragraph>
                        {task?.result_content}
                      </Typography.Paragraph>
                    ),
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text strong>{item.label}:</Typography.Text>{" "}
                    {item.value}
                  </List.Item>
                )}
              />
            </Flex>
          ) : (
            <Typography.Text type="secondary">
              Không có kết quả.
            </Typography.Text>
          )}
          <Divider />
          <Typography.Title level={4}>Chi tiết vấn đề</Typography.Title>
          <List
            bordered
            dataSource={[
              {
                label: "Ngày phát hiện",
                value: <DateField value={task?.created_date} />,
              },

              {
                label: "Trạng thái",
                value: <ProblemStatusTag status={task?.status} />,
              },
              {
                label: "Mô tả vấn đề",
                value: (
                  <Typography.Paragraph>
                    {task?.description}
                  </Typography.Paragraph>
                ),
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.label}:</Typography.Text>{" "}
                {item.value}
              </List.Item>
            )}
          />

          <ReportProblemModal
            close={() => {
              setIsModalOpen(false);
            }}
            open={isModalOpen}
            status={defaultReportStatus}
          />
        </Flex>
      </Drawer>
    </>
  );
};
