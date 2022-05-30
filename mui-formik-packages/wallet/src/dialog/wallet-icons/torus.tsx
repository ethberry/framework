import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const TorusIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <circle cx="30" cy="30" r="30" fill="#D9E8FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 24.4V16H33.4211V30V44H25.2105V24.4H17ZM38.8949 24.4C41.1622 24.4 43.0002 22.5196 43.0002 20.2C43.0002 17.8804 41.1622 16 38.8949 16C36.6277 16 34.7897 17.8804 34.7897 20.2C34.7897 22.5196 36.6277 24.4 38.8949 24.4Z"
        fill="#438BF3"
      />
    </SvgIcon>
  );
};
