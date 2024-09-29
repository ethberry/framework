import { IThemeProviderProps } from "@ethberry/provider-theme";

export const themeProps: IThemeProviderProps = {
  options: {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "::-webkit-scrollbar": {
            height: 4,
            width: 4,
          },
          "::-webkit-scrollbar-track": {
            background: "rgba(119, 129, 146, 0.3)",
            borderRadius: "100px",
          },
          "::-webkit-scrollbar-thumb": {
            background: "rgba(119, 129, 146, 0.4)",
            borderRadius: "100px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: "rgba(119, 129, 146, 0.8)",
          },
        },
      },
    },
  },
};
