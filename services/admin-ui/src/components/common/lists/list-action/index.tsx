import { FC, PropsWithChildren } from "react";
import { IconButton, ListItemIcon, MenuItem, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface IStyledListActionProps {
  icon: any;
  message: string;
  onClick: () => void;
  disabled?: boolean;
  isMenuItem?: boolean;
}

export const StyledListAction: FC<PropsWithChildren<IStyledListActionProps>> = props => {
  const { icon: Icon, isMenuItem, message, disabled, onClick } = props;

  return isMenuItem ? (
    <MenuItem onClick={onClick} disabled={disabled}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <Typography variant="inherit">
        <FormattedMessage id={message} />
      </Typography>
    </MenuItem>
  ) : (
    <IconButton onClick={onClick} disabled={disabled}>
      <Icon />
    </IconButton>
  );
};
