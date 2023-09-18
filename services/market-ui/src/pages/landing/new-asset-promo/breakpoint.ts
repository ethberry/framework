import { Theme } from "@mui/material/styles";
import { CreateCSSProperties } from "@mui/styles";

type TMixin = (styles: CreateCSSProperties) => CreateCSSProperties;

export const initBreakpoint = <T extends Record<string, number>>(theme: Theme, sizes: T): Record<keyof T, TMixin> => {
  return Object.keys(sizes).reduce(
    (mixins, key) => {
      return Object.assign(mixins, {
        [key]: (styles: CreateCSSProperties): CreateCSSProperties => ({
          [theme.breakpoints.down(sizes[key])]: {
            ...styles,
          },
        }),
      });
    },
    {} as Record<keyof T, TMixin>,
  );
};
