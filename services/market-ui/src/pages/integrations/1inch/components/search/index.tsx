import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, InputBase, InputBaseProps, Paper } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

import { useStyles } from "./styles";

export interface ISearchInputProps extends InputBaseProps {}

export const SearchInput: FC<ISearchInputProps> = props => {
  const { name = "search", ...rest } = props;
  const classes = useStyles();

  const { formatMessage } = useIntl();

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchOutlined />
      </IconButton>
      <InputBase
        name={name}
        className={classes.input}
        placeholder={formatMessage({ id: `form.placeholders.${name}` })}
        {...rest}
      />
    </Paper>
  );
};
