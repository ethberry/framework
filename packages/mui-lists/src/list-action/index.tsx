import { FC, PropsWithChildren } from "react";
import {
  Button,
  ButtonPropsVariantOverrides,
  IconButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { FormattedMessage, useIntl } from "react-intl";

import { ListActionVariant } from "../interface";

export interface IListActionProps {
  icon: any;
  message: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: ListActionVariant;
  dataTestId?: string;
  buttonVariant?: OverridableStringUnion<"text" | "outlined" | "contained", ButtonPropsVariantOverrides>;
  className?: string; // for button toolbar
}

export const ListAction: FC<PropsWithChildren<IListActionProps>> = props => {
  const {
    icon: Icon,
    variant = ListActionVariant.iconButton,
    buttonVariant = "outlined",
    className,
    dataTestId,
    message,
    disabled,
    onClick,
  } = props;

  const { formatMessage } = useIntl();

  switch (variant) {
    case ListActionVariant.button:
      return (
        <Button
          className={className}
          variant={buttonVariant}
          onClick={onClick}
          disabled={disabled}
          startIcon={<Icon />}
          data-testid={dataTestId}
        >
          <FormattedMessage id={message} />
        </Button>
      );
    case ListActionVariant.menuItem:
      return (
        <MenuItem onClick={onClick} disabled={disabled} data-testid={dataTestId}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <Typography variant="inherit">
            <FormattedMessage id={message} />
          </Typography>
        </MenuItem>
      );
    case ListActionVariant.iconButton:
    default:
      return (
        <Tooltip title={formatMessage({ id: message })}>
          <IconButton onClick={onClick} disabled={disabled} data-testid={dataTestId}>
            <Icon />
          </IconButton>
        </Tooltip>
      );
  }
};
