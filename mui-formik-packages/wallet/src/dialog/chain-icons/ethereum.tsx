import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const Ethereum: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <path
        d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
        fill="#627EEA"
      />
      <path d="M29.9961 14L29.7776 14.7293V35.8904L29.9961 36.1046L39.9937 30.2984L29.9961 14Z" fill="#C0CBF6" />
      <path d="M29.9979 14L20 30.2984L29.9979 36.1046V25.8336V14Z" fill="white" />
      <path d="M29.9962 37.9614L29.873 38.1089V45.6468L29.9962 46.0001L40 32.1582L29.9962 37.9614Z" fill="#C0CBF6" />
      <path d="M29.9979 46.0001V37.9614L20 32.1582L29.9979 46.0001Z" fill="white" />
      <path d="M29.9963 36.116L39.9939 30.3098L29.9963 25.845V36.116Z" fill="#8197EE" />
      <path d="M20 30.3098L29.9979 36.116V25.845L20 30.3098Z" fill="#C0CBF6" />
    </SvgIcon>
  );
};
