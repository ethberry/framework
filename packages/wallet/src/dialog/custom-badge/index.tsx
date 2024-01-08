import { FC, PropsWithChildren } from "react";
import { Badge, BadgeProps } from "@mui/material";
import { Check } from "@mui/icons-material";

export interface ICustomBadgeProps {
  invisible: boolean;
  badgeProps?: BadgeProps;
}

export const CustomBadge: FC<PropsWithChildren<ICustomBadgeProps>> = props => {
  const { invisible, badgeProps, children } = props;

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
      {...badgeProps}
    >
      {children}
    </Badge>
  );
};
