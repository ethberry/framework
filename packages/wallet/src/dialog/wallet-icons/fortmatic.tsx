import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const FortmaticIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <circle cx="30" cy="30" r="30" fill="#E6E3FF" />
      <path d="M16 16V44H23.7778V23.7778H44V16H16Z" fill="#6851FF" />
      <path d="M30 30V37.7778H36.2222V44C40.8889 44 44 40.1111 44 37V30H30Z" fill="#6851FF" />
    </SvgIcon>
  );
};
