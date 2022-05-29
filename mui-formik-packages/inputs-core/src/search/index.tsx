import { FC, SyntheticEvent, useCallback } from "react";
import { useIntl } from "react-intl";
import { IconButton, InputBase, InputBaseProps, Paper } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useFormContext, Controller } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

import { useStyles } from "./styles";

export interface ISearchInputProps extends InputBaseProps {
  onSearch?: (values: any) => void;
}

export const SearchInput: FC<ISearchInputProps> = props => {
  const { name = "search", onSearch } = props;
  const classes = useStyles();

  const form = useFormContext<any>();

  const { formatMessage } = useIntl();
  const localizedPlaceholder = formatMessage({ id: `form.placeholders.${name}` });

  const debouncedOnChange = useDebouncedCallback(() => {
    onSearch && onSearch(form.getValues());
  }, 500);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => {
        const handleChange = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
          field.onChange(e);
          debouncedOnChange();
        }, []) as any;

        return (
          <Paper className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="search">
              <SearchOutlined />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder={localizedPlaceholder}
              {...field}
              onChange={handleChange}
            />
          </Paper>
        );
      }}
    />
  );
};
