import {
  type HttpError,
  useGo,
  useList,
  useNavigation,
  useTranslate,
  useSelect,
  useCreate,
} from "@refinedev/core";
import { useSimpleList, List as RefineList, EditButton } from "@refinedev/antd";
import {
  Card,
  Divider,
  Flex,
  List,
  Tag,
  Typography,
  theme,
  Skeleton,
  Modal,
  Upload,
  Button,
  message,
  Descriptions,
  Spin,
  Tabs,
  Table,
  Space,
} from "antd";
import { PaginationTotal } from "../../components/paginationTotal";
import {
  EyeOutlined,
  TagOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  DownloadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { PropsWithChildren, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NumberWithUnit } from "../../components/number-with-unit";
import { createStyles } from "antd-style";
import { IPlant, ITemplate, IItem, IFertilizer, IPesticide } from "@/interfaces";
import type { ColumnType } from "antd/es/table";

const useStyles = createStyles(({ token }) => {
  return {
    card: {
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.07)",
      transition: "all 0.3s",
      ":hover": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        ".viewButton": {
          display: "block !important",
        },
      },
    },
    cardCover: {
      position: "relative",
      height: "200px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "8px 8px 0 0",
      overflow: "hidden",
    },
    viewButton: {
      position: "absolute",
      display: "none !important",
      width: "max-content !important",
      top: "50%",
      left: 0,
      marginLeft: "50%",
      transform: "translate(-50%, -50%)",
      padding: "5px 12px 5px 12px",
      zIndex: 1,
      backgroundColor: token.colorBgContainer,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
    seasonTag: {
      position: "absolute",
      top: "8px",
      left: "8px",
      zIndex: 1,
    },
    cardContent: {
      padding: "16px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    cardMeta: {
      marginBottom: "12px",
    },
    cardFooter: {
      marginTop: "auto",
      paddingTop: "12px",
      borderTop: `1px solid ${token.colorBorder}`,
      alignItems: "center",
      justifyContent: "space-between",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    icon: {
      color: token.colorTextSecondary,
      fontSize: "14px",
    },
    dateRange: {
      fontSize: "12px",
      color: token.colorTextSecondary,
    },
  };
});

export const TemplateList = ({ children }: PropsWithChildren) => {
  const { styles, cx } = useStyles();
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createTemplate, isLoading: isCreating } = useCreate<ITemplate>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReviewCancel = () => {
    setIsReviewModalOpen(false);
    setReviewData(null);
  };

  const handleSubmit = async () => {
    try {
      await createTemplate({
        resource: "templates",
        values: reviewData,
        successNotification: {
          message: "Template created successfully",
          type: "success",
        },
        errorNotification: {
          message: "Failed to create template",
          type: "error",
        },
      });
      setIsReviewModalOpen(false);
      setReviewData(null);
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const {
    listProps: templateListProps,
    filters,
    setFilters,
  } = useSimpleList<ITemplate, HttpError>({
    pagination: {
      current: 1,
      pageSize: 12,
    },
    filters: {
      initial: [
        {
          field: "plant_id",
          operator: "in",
          value: [],
        },
      ],
    },
  });

  const { refetch } = useList<ITemplate, HttpError>({
    resource: "templates",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  const { data: plantData, isLoading: plantIsLoading } = useList<IPlant, HttpError>({
    resource: "plants",
    pagination: {
      mode: "off",
    },
  });

  const plants = plantData?.data || [];

  const plantFilters = useMemo(() => {
    const filter = filters.find((filter) => {
      if ("field" in filter) {
        return filter.field === "plant_id";
      }
      return false;
    });

    return {
      operator: filter?.operator || "in",
      value: (filter?.value || []) as string[],
    };
  }, [filters]).value;

  const hasPlantFilter = plantFilters?.length > 0;

  const handleOnTagClick = (plantId: string) => {
    const newFilters = [...plantFilters];
    const hasCurrentFilter = newFilters.includes(plantId);

    // If clicking the same plant, clear the filter
    if (hasCurrentFilter) {
      setFilters([
        {
          field: "plant_id",
          operator: "in",
          value: [],
        },
      ]);
    } else {
      // Only allow one plant to be selected at a time
      setFilters([
        {
          field: "plant_id",
          operator: "in",
          value: [plantId],
        },
      ]);
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season?.toLowerCase()) {
      case "mùa xuân":
        return "green";
      case "mùa hè":
        return "red";
      case "mùa thu":
        return "orange";
      case "mùa đông":
        return "blue";
      case "quanh năm":
        return "purple";
      case "mùa mát (mùa chính)":
        return "cyan";
      case "mùa nóng (mùa phụ)":
        return "magenta";
      default:
        return "default";
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const { options: itemsOptions } = useSelect<IItem>({
    resource: "items",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: fertilizersOptions } = useSelect<IFertilizer>({
    resource: "fertilizers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: pesticidesOptions } = useSelect<IPesticide>({
    resource: "pesticides",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: plantOptions } = useSelect<IPlant>({
    resource: "plants",
    optionLabel: "plant_name",
    optionValue: "id",
  });

  const renderItems = (items: any[]) => {
    if (!items?.length) return "-";
    return (
      <div>
        {items.map((item, index) => {
          const itemName = itemsOptions?.find(
            (opt: { value: string; label: string }) => opt.value === item.item_id,
          )?.label;
          return (
            <div key={index}>
              {`${itemName}: ${item.quantity} ${item.unit}`}
              {index < items.length - 1 && <br />}
            </div>
          );
        })}
      </div>
    );
  };

  const renderFertilizers = (fertilizers: any[]) => {
    if (!fertilizers?.length) return "-";
    return (
      <div>
        {fertilizers.map((fertilizer, index) => {
          const fertilizerName = fertilizersOptions?.find(
            (opt: { value: string; label: string }) => opt.value === fertilizer.fertilizer_id,
          )?.label;
          return (
            <div key={index}>
              {`${fertilizerName}: ${fertilizer.quantity} ${fertilizer.unit}`}
              {index < fertilizers.length - 1 && <br />}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPesticides = (pesticides: any[]) => {
    if (!pesticides?.length) return "-";
    return (
      <div>
        {pesticides.map((pesticide, index) => {
          const pesticideName = pesticidesOptions?.find(
            (opt: { value: string; label: string }) => opt.value === pesticide.pesticide_id,
          )?.label;
          return (
            <div key={index}>
              {`${pesticideName}: ${pesticide.quantity} ${pesticide.unit}`}
              {index < pesticides.length - 1 && <br />}
            </div>
          );
        })}
      </div>
    );
  };

  const caringColumns: ColumnType<any>[] = [
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
      fixed: "left" as const,
      width: 200,
      render: (text: string) => <div style={{ whiteSpace: "nowrap" }}>{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Task Type",
      dataIndex: "task_type",
      key: "task_type",
    },
    {
      title: "Start In",
      dataIndex: "start_in",
      key: "start_in",
      render: (value: number) => `${value} hours`,
    },
    {
      title: "End In",
      dataIndex: "end_in",
      key: "end_in",
      render: (value: number) => `${value} hours`,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: renderItems,
    },
    {
      title: "Fertilizers",
      dataIndex: "fertilizers",
      key: "fertilizers",
      render: renderFertilizers,
    },
    {
      title: "Pesticides",
      dataIndex: "pesticides",
      key: "pesticides",
      render: renderPesticides,
    },
  ];

  const inspectingColumns: ColumnType<any>[] = [
    {
      title: "Form Name",
      dataIndex: "form_name",
      key: "form_name",
      fixed: "left" as const,
      width: 200,
      render: (text: string) => <div style={{ whiteSpace: "nowrap" }}>{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start In",
      dataIndex: "start_in",
      key: "start_in",
      render: (value: number) => `${value} hours`,
    },
    {
      title: "End In",
      dataIndex: "end_in",
      key: "end_in",
      render: (value: number) => `${value} hours`,
    },
  ];

  const harvestingColumns: ColumnType<any>[] = [
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
      fixed: "left" as const,
      width: 200,
      render: (text: string) => <div style={{ whiteSpace: "nowrap" }}>{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start In",
      dataIndex: "start_in",
      key: "start_in",
      render: (value: number) => `${value} hours`,
    },
    {
      title: "End In",
      dataIndex: "end_in",
      key: "end_in",
      render: (value: number) => `${value} hours`,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: renderItems,
    },
  ];

  return (
    <>
      <RefineList
        headerButtons={() => [
          <Button
            key="create"
            size="large"
            type="primary"
            icon={<UploadOutlined />}
            onClick={showModal}
          >
            {t("templates.actions.upload", "Upload Template")}
          </Button>,
        ]}
      >
        <Modal
          title={t("templates.actions.upload", "Upload Template")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Flex vertical gap="middle">
            <Typography.Text>
              {t(
                "templates.upload.instructions",
                "Please upload an Excel file (.xlsx or .xls) containing your template data. Make sure the file follows the required format.",
              )}
            </Typography.Text>
            <Button type="primary" icon={<DownloadOutlined />} href="/templates/TemplateForm.xlsx">
              {t("templates.actions.downloadSample", "Download Sample Template")}
            </Button>
            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".xlsx,.xls"
              action="https://api.bfarmx.space/api/templates/excel"
              onChange={(info) => {
                const { status, response } = info.file;
                if (status === "done") {
                  message.success(`${info.file.name} file uploaded successfully.`);
                  handleOk();
                  setReviewData(response.data);
                  setIsReviewModalOpen(true);
                } else if (status === "error") {
                  message.error(response?.message || `${info.file.name} file upload failed.`);
                }
              }}
              headers={{
                accept: "*/*",
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                {t("templates.upload.dragText", "Click or drag file to this area to upload")}
              </p>
              <p className="ant-upload-hint">
                {t("templates.upload.hint", "Support for a single Excel file (.xlsx or .xls)")}
              </p>
            </Upload.Dragger>
          </Flex>
        </Modal>

        <Modal
          title="Review Template Data"
          open={isReviewModalOpen}
          onCancel={handleReviewCancel}
          width={1000}
          footer={[
            <Button key="cancel" onClick={handleReviewCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit} loading={isCreating}>
              Submit
            </Button>,
          ]}
        >
          {reviewData && (
            <Spin spinning={isCreating}>
              <Flex vertical gap="large">
                <Card
                  title="Basic Information"
                  styles={{
                    header: {
                      background: token.colorPrimaryBg,
                      borderBottom: `1px solid ${token.colorBorder}`,
                    },
                    body: {
                      padding: "24px",
                    },
                  }}
                >
                  <Flex vertical gap="middle">
                    <Descriptions bordered column={2} size="middle">
                      <Descriptions.Item label="Plant" span={2}>
                        <Typography.Text strong>
                          {plants.find((plant) => plant.id === reviewData.plant_id)?.plant_name ||
                            reviewData.plant_id}
                        </Typography.Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Season Type">
                        <Tag color={getSeasonColor(reviewData.season_type)}>
                          {reviewData.season_type}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Duration">
                        {reviewData.duration_days} days
                      </Descriptions.Item>
                      <Descriptions.Item label="Start Date">
                        {formatDate(reviewData.start_date)}
                      </Descriptions.Item>
                      <Descriptions.Item label="End Date">
                        {formatDate(reviewData.end_date)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Estimated Yield">
                        <NumberWithUnit value={reviewData.estimated_per_one} unit="kg/cây" />
                      </Descriptions.Item>
                    </Descriptions>

                    <Card
                      title="Description"
                      styles={{
                        header: {
                          background: token.colorPrimaryBg,
                          borderBottom: `1px solid ${token.colorBorder}`,
                        },
                        body: {
                          padding: "16px",
                        },
                      }}
                    >
                      <Typography.Paragraph style={{ margin: 0 }}>
                        {reviewData.description}
                      </Typography.Paragraph>
                    </Card>
                  </Flex>
                </Card>

                <Card
                  title="Plant Template"
                  styles={{
                    header: {
                      background: token.colorPrimaryBg,
                      borderBottom: `1px solid ${token.colorBorder}`,
                    },
                  }}
                >
                  <Descriptions bordered column={2} size="middle">
                    <Descriptions.Item label="Season Type">
                      <Tag color={getSeasonColor(reviewData.plant_template.season_type)}>
                        {reviewData.plant_template.season_type}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Sample Quantity">
                      {reviewData.plant_template.sample_quantity}
                    </Descriptions.Item>
                  </Descriptions>

                  <Tabs
                    items={[
                      {
                        key: "caring",
                        label: "Caring Tasks",
                        children: (
                          <Table
                            columns={caringColumns}
                            dataSource={reviewData.plant_template.caring_tasks}
                            pagination={false}
                            scroll={{ x: true, y: 400 }}
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          />
                        ),
                      },
                      {
                        key: "inspecting",
                        label: "Inspecting Tasks",
                        children: (
                          <Table
                            columns={inspectingColumns}
                            dataSource={reviewData.plant_template.inspecting_tasks}
                            pagination={false}
                            scroll={{ x: true, y: 400 }}
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          />
                        ),
                      },
                      {
                        key: "harvesting",
                        label: "Harvesting Tasks",
                        children: (
                          <Table
                            columns={harvestingColumns}
                            dataSource={reviewData.plant_template.harvesting_task_templates}
                            pagination={false}
                            scroll={{ x: true, y: 400 }}
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          />
                        ),
                      },
                    ]}
                  />
                </Card>
              </Flex>
            </Spin>
          )}
        </Modal>

        <Divider style={{ margin: "16px 0px" }} />
        <Flex
          wrap="nowrap"
          gap={12}
          style={{
            width: "100%",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          <Tag
            style={{ padding: "4px 10px 4px 10px", cursor: "pointer" }}
            color={!hasPlantFilter ? token.colorPrimary : undefined}
            icon={<TagOutlined />}
            onClick={() => {
              setFilters([
                {
                  field: "plant_id",
                  operator: "in",
                  value: [],
                },
              ]);
            }}
          >
            {t("templates.filter.allPlants.label", "All Plants")}
          </Tag>
          {!plantIsLoading &&
            plants.map((plant) => (
              <Tag
                key={plant.id}
                color={plantFilters?.includes(plant.id.toString()) ? token.colorPrimary : undefined}
                style={{
                  padding: "4px 10px 4px 10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleOnTagClick(plant.id.toString());
                }}
              >
                {plant.plant_name}
              </Tag>
            ))}

          {plantIsLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton.Button
                key={index}
                style={{
                  width: "108px",
                  height: "30px",
                }}
                active
              />
            ))}
        </Flex>
        <Divider style={{ margin: "16px 0px" }} />
        <List
          {...templateListProps}
          pagination={{
            ...templateListProps.pagination,
            showTotal: (total: number) => (
              <PaginationTotal total={total} entityName={"templates"} />
            ),
          }}
          grid={{
            gutter: [16, 16],
            column: 4,
            xxl: 4,
            xl: 4,
            lg: 3,
            md: 2,
            sm: 1,
            xs: 1,
          }}
          renderItem={(item: any) => {
            const plant = plants.find((p) => p.id === item.plant_id);
            return (
              <List.Item style={{ height: "100%" }}>
                <Card
                  onClick={() => {
                    go({
                      to: `/templates/${item.id}/edit`,
                      type: "push",
                    });
                  }}
                  hoverable
                  variant="outlined"
                  className={styles.card}
                  styles={{
                    body: {
                      padding: 0,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    },
                  }}
                >
                  <div
                    className={styles.cardCover}
                    style={{
                      backgroundImage: `url(${plant?.image_url})`,
                    }}
                  >
                    <EditButton
                      icon={<EyeOutlined />}
                      className={cx(styles.viewButton, "viewButton")}
                      recordItemId={item.id}
                    >
                      {" "}
                      Edit
                    </EditButton>
                    <Tag color={getSeasonColor(item.season_type)} className={styles.seasonTag}>
                      {item.season_type}
                    </Tag>
                  </div>

                  <div className={styles.cardContent}>
                    <Flex justify="space-between" align="center" className={styles.cardMeta}>
                      <Typography.Title
                        level={5}
                        ellipsis={{
                          rows: 1,
                          tooltip: plant?.plant_name,
                        }}
                        style={{ margin: 0 }}
                      >
                        {plant?.plant_name}
                      </Typography.Title>
                      <Tag color={getSeasonColor(item.season_type)}>{item.season_type}</Tag>
                    </Flex>

                    <Typography.Paragraph
                      ellipsis={{ rows: 2, tooltip: item.description }}
                      style={{ marginBottom: 12 }}
                    >
                      {item.description}
                    </Typography.Paragraph>

                    <div className={styles.infoRow}>
                      <EnvironmentOutlined className={styles.icon} />
                      <Typography.Text type="secondary" ellipsis>
                        {plant?.plant_name}
                      </Typography.Text>
                    </div>

                    <Flex className={styles.cardFooter}>
                      <Flex align="center" gap={8}>
                        <CalendarOutlined className={styles.icon} />
                        <span className={styles.dateRange}>
                          {formatDate(item.start_date)} - {formatDate(item.end_date)}
                        </span>
                      </Flex>
                      <NumberWithUnit value={item.estimated_per_one} unit="kg/cây" />
                    </Flex>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
        {children}
      </RefineList>
    </>
  );
};
