// import { Link } from "react-router";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";

import { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import {
  useGetLocale,
  useSetLocale,
  useGetIdentity,
  useTranslate,
  pickNotDeprecated,
} from "@refinedev/core";

import { IconMoon, IconSun } from "../../components/icons";
import { useConfigProvider } from "../../context";
import type { IIdentity } from "../../interfaces";
import { useStyles } from "./styled";

import {
  Dropdown,
  Input,
  Avatar,
  Typography,
  Space,
  Grid,
  Row,
  Col,
  AutoComplete,
  Layout as AntdLayout,
  Button,
  theme,
  type MenuProps,
} from "antd";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { Text } = Typography;
const { useBreakpoint } = Grid;

interface IOptionGroup {
  value: string;
  label: string | React.ReactNode;
}

interface IOptions {
  label: string | React.ReactNode;
  options: IOptionGroup[];
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ isSticky, sticky }) => {
  const { token } = useToken();
  const { styles } = useStyles();
  const { mode, setMode } = useConfigProvider();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity<IIdentity>();
  const screens = useBreakpoint();
  const t = useTranslate();

  const currentLocale = locale();

  // const renderTitle = (title: string) => (
  //   <div className={styles.headerTitle}>
  //     <Text style={{ fontSize: "16px" }}>{title}</Text>
  //     <Link to={`/${title.toLowerCase()}`}>{t("search.more")}</Link>
  //   </div>
  // );

  // const renderItem = (title: string, imageUrl: string, link: string) => ({
  //   value: title,
  //   label: (
  //     <Link to={link} style={{ display: "flex", alignItems: "center" }}>
  //       {imageUrl && (
  //         <Avatar
  //           size={32}
  //           src={imageUrl}
  //           style={{ minWidth: "32px", marginRight: "16px" }}
  //         />
  //       )}
  //       <Text>{title}</Text>
  //     </Link>
  //   ),
  // });

  const [value, setValue] = useState<string>("");
  const [options, setOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    setOptions([]);
  }, [value]);

  const menuItems: MenuProps["items"] = [...(i18n.languages || [])].sort().map((lang: string) => ({
    key: lang,
    onClick: () => changeLanguage(lang),
    icon: (
      <span style={{ marginRight: 8 }}>
        <Avatar size={16} src={`/images/flags/${lang}.svg`} />
      </span>
    ),
    label: lang === "en" ? "English" : "Tiếng Việt",
  }));
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    padding: "0px 24px",
  };

  if (pickNotDeprecated(sticky, isSticky)) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1000;
  }
  return (
    <AntdHeader style={headerStyles}>
      <Row
        align="middle"
        style={{
          justifyContent: screens.sm ? "space-between" : "end",
        }}
      >
        <Col xs={0} sm={8} md={12}>
          <AutoComplete
            style={{
              width: "100%",
              maxWidth: "550px",
            }}
            options={options}
            filterOption={false}
            onSearch={debounce((value: string) => setValue(value), 300)}
          >
            <Input
              size="large"
              placeholder={t("search.placeholder")}
              suffix={<div className={styles.inputSuffix}>/</div>}
              prefix={<SearchOutlined className={styles.inputPrefix} />}
            />
          </AutoComplete>
        </Col>
        <Col>
          <Space size={screens.md ? 32 : 16} align="center">
            <Dropdown
              menu={{
                items: menuItems,
                selectedKeys: currentLocale ? [currentLocale] : [],
              }}
            >
              <Button onClick={(e) => e.preventDefault()}>
                <Space>
                  <Text className={styles.languageSwitchText}>
                    {currentLocale === "en" ? "English" : "Tiếng Việt"}
                  </Text>
                  <DownOutlined className={styles.languageSwitchIcon} />
                </Space>
              </Button>
            </Dropdown>

            <Button
              className={styles.themeSwitch}
              type="text"
              icon={mode === "light" ? <IconMoon /> : <IconSun />}
              onClick={() => {
                setMode(mode === "light" ? "dark" : "light");
              }}
            />

            <Space size={screens.md ? 16 : 8} align="center">
              <Text ellipsis className={styles.userName}>
                {user?.name}
              </Text>
              <Avatar size="large" src={user?.avatar} alt={user?.name} />
            </Space>
          </Space>
        </Col>
      </Row>
    </AntdHeader>
  );
};
