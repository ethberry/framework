import { IThemeProviderProps } from "@gemunion/provider-theme";

export const themeProps: IThemeProviderProps = {
  options: {
    components: {
      MuiCardHeader: {
        styleOverrides: {
          content: {
            width: "100%",
          },
          title: {
            whiteSpace: "nowrap",
            overflow: "auto",
            textOverflow: "ellipsis",
          },
        },
      },
    },
  },
};
