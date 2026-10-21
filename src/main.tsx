import {
  RouterProvider,
} from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";
import router from "./routes";
import { antdTheme } from "./config/theme";

axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider theme={antdTheme} locale={idID}>
        <App>
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);
