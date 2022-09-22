import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const Ethereum: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#627EEA"
      />
      <path
        d="M11.9985 5.6001L11.9111 5.89182V14.3563L11.9985 14.4419L15.9976 12.1195L11.9985 5.6001Z"
        fill="#C0CBF6"
      />
      <path d="M11.9992 5.6001L8 12.1195L11.9992 14.4419V10.3335V5.6001Z" fill="white" />
      <path d="M11.9985 15.1846L11.9492 15.2436V18.2587L11.9985 18.4L16 12.8633L11.9985 15.1846Z" fill="#C0CBF6" />
      <path d="M11.9992 18.4V15.1846L8 12.8633L11.9992 18.4Z" fill="white" />
      <path d="M11.9985 14.4465L15.9976 12.1241L11.9985 10.3381V14.4465Z" fill="#8197EE" />
      <path d="M8 12.1238L11.9992 14.4463V10.3379L8 12.1238Z" fill="#C0CBF6" />
    </SvgIcon>
  );
};
