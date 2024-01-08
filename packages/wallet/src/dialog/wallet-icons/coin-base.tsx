import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const CoinBaseIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <circle cx="30" cy="30" r="30" fill="#C4D4FF" />
      <rect x="14" y="14" width="32" height="32" rx="16" fill="url(#paint0_linear)" />
      <rect x="21" y="21" width="18" height="18" rx="9" fill="white" />
      <rect x="27" y="27" width="6" height="6" rx="1" fill="url(#paint1_linear)" />
      <defs>
        <linearGradient id="paint0_linear" x1="30" y1="14" x2="30" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2D66F5" />
          <stop offset="1" stopColor="#144ADF" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="30" y1="27" x2="30" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2D66F5" />
          <stop offset="1" stopColor="#144ADF" />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
};
