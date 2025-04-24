import { type HttpError, useGo, useList, useNavigation, useTranslate } from "@refinedev/core";
import { useSimpleList, List as RefineList, EditButton, Edit } from "@refinedev/antd";
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    listProps: templateListProps,
    filters,
    setFilters,
  } = useSimpleList<any, HttpError>({
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

  const { data: plantData, isLoading: plantIsLoading } = useList<any, HttpError>({
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
              action="/api/templates/upload"
              onChange={(info) => {
                const { status } = info.file;
                if (status === "done") {
                  message.success(`${info.file.name} file uploaded successfully.`);
                  handleOk();
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
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
            showTotal: (total: number) => <PaginationTotal total={total} entityName={"template"} />,
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
                      to: `/template/${item.id}/edit`,
                      type: "push",
                    });
                  }}
                  hoverable
                  bordered={false}
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
