import { ReactNode } from "react";
import { BadgeProps, IconButtonProps, SvgIconProps } from "@mui/material";

export interface IWalletButtonProps {
  onClick: () => void;
  disabled?: boolean;
  badgeProps?: BadgeProps;
  iconButtonProps?: IconButtonProps;
  iconProps?: SvgIconProps;
  customIcon?: ReactNode;
}
