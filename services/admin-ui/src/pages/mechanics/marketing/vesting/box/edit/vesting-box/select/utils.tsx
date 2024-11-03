import { MenuItem } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { IOption } from "./types";

export const displayItems = <T extends string | number>(
  options: Record<string, T> | Array<IOption<T>>,
  disabledOptions: Array<T>,
  suffix: string,
) => {
  if (Array.isArray(options)) {
    return options.map((option, i) => (
      <MenuItem value={option.value} key={i} disabled={disabledOptions.includes(option.value)}>
        <FormattedMessage id={`enums.${suffix}.${option.title}`} />
      </MenuItem>
    ));
  } else {
    return Object.values(options).map((option, i) => (
      <MenuItem value={option} key={i} disabled={disabledOptions.includes(option)}>
        <FormattedMessage id={`enums.${suffix}.${option}`} />
      </MenuItem>
    ));
  }
};

export const displayValue = <T extends string | number>(
  options: Record<string, T> | Array<IOption<T>>,
  formatMessage: (...args: any) => string,
  suffix: string,
  multiple?: boolean,
) => {
  if (Array.isArray(options)) {
    if (multiple) {
      return (values: Array<T>): string => {
        const valuesArray = Array.isArray(values) ? values : ([values] as Array<T>);
        return options
          .filter(option => valuesArray.includes(option.value))
          .map(item => formatMessage({ id: `enums.${suffix}.${item.title}` }))
          .join(", ");
      };
    } else {
      return (value: T): string => {
        const foundValue = options.find(option => option.value === value);
        return foundValue ? formatMessage({ id: `enums.${suffix}.${foundValue.title}` }) : "";
      };
    }
  } else {
    return multiple
      ? (values: Array<T>): string =>
          (Array.isArray(values) ? values : [values])
            .map(value => (value ? formatMessage({ id: `enums.${suffix}.${value}` }) : ""))
            .join(", ")
      : (value: T): string => (value ? formatMessage({ id: `enums.${suffix}.${value as string}` }) : "");
  }
};
