import { ElementType, FC } from "react";
import {
  Button,
  ButtonPropsVariantOverrides,
  IconButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import { OverridableStringUnion } from "@mui/types";
import { FormattedMessage, useIntl } from "react-intl";

import { ListActionVariant } from "../interface";

export interface IListActionProps {
  icon?: ElementType;
  message: string;
  messageValues?: Record<string, any>;
  onClick: () => void;
  disabled?: boolean;
  variant?: ListActionVariant;
  dataTestId?: string;
  buttonVariant?: OverridableStringUnion<"text" | "outlined" | "contained", ButtonPropsVariantOverrides>;
  className?: string; // for button toolbar
}

export const ListAction: FC<IListActionProps> = props => {
  const {
    icon: Icon,
    variant = ListActionVariant.iconButton,
    buttonVariant = "outlined",
    className,
    dataTestId,
    message,
    messageValues = {},
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
          startIcon={Icon ? <Icon /> : null}
          data-testid={dataTestId}
        >
          <FormattedMessage id={message} values={messageValues} />
        </Button>
      );
    case ListActionVariant.menuItem:
      return (
        <MenuItem onClick={onClick} disabled={disabled} data-testid={dataTestId}>
          {Icon ? (
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
          ) : null}

          <Typography variant="inherit">
            <FormattedMessage id={message} values={messageValues} />
          </Typography>
        </MenuItem>
      );
    case ListActionVariant.iconButton:
    default:
      return (
        <Tooltip title={formatMessage({ id: message }, { ...messageValues })}>
          <IconButton onClick={onClick} disabled={disabled} data-testid={dataTestId}>
            {Icon ? <Icon /> : <Warning />}
          </IconButton>
        </Tooltip>
      );
  }
};
