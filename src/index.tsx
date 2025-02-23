import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import WeekDay from "dayjs/plugin/weekday";

import App from "./App";
import "./i18n";

import React from "react";
import { createRoot } from "react-dom/client";

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);

const container = document.getElementById("root");

const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
);
