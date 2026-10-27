import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#00A651",
    colorSuccess: "#00A651",
    colorWarning: "#F58220",
    borderRadius: 8,
  },
  components: {
    Input: {
      activeBorderColor: "#00A651",
      hoverBorderColor: "#00A651",
    },
    Button: {
      colorPrimary: "#00A651",
      colorPrimaryHover: "#009245",
    },
  },
};
