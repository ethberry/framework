import { FC } from "react";
import { Badge, BadgeProps } from "@mui/material";
import { Check } from "@mui/icons-material";

export interface ICustomBadgeProps {
  invisible: boolean;
  BadgeProps?: BadgeProps;
}

export const CustomBadge: FC<ICustomBadgeProps> = props => {
  const { invisible, BadgeProps, children } = props;

  return (
    <Badge
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      color="secondary"
      overlap="circular"
      invisible={invisible}
      badgeContent={<Check sx={{ fontSize: 8 }} />}
      {...BadgeProps}
    >
      {children}
    </Badge>
  );
};
