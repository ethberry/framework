import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, InputBase, InputBaseProps, Paper } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";

export interface ISearchInputProps extends InputBaseProps {}

export const SearchInput: FC<ISearchInputProps> = props => {
  const { name = "search", ...rest } = props;

  const { formatMessage } = useIntl();

  return (
    <Paper
      sx={{
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <IconButton aria-label="search" sx={{ p: "10px" }}>
        <SearchOutlined />
      </IconButton>
      <InputBase
        name={name}
        sx={{
          marginLeft: 1,
          flex: 1,
        }}
        placeholder={formatMessage({ id: `form.placeholders.${name}` })}
        {...rest}
      />
    </Paper>
  );
};
