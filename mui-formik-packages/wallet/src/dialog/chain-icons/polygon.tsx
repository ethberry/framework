import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const Polygon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <path
        d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
        fill="#8247E5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.0287 13.2517C20.6328 12.9161 21.3672 12.9161 21.9713 13.2517L30.9713 18.2517C31.6062 18.6044 32 19.2737 32 20V23.2517L28 25.5V21.1768L21 17.2879L14 21.1768V28.8232L21 32.7121L38.0287 23.2517C38.6328 22.9161 39.3672 22.9161 39.9713 23.2517L48.9713 28.2517C49.6062 28.6044 50 29.2737 50 30V40C50 40.7263 49.6062 41.3956 48.9713 41.7483L39.9713 46.7483C39.3672 47.0839 38.6328 47.0839 38.0287 46.7483L29.0287 41.7483C28.3938 41.3956 28 40.7263 28 40V36.7483L32 34.5V38.8232L39 42.7121L46 38.8232V31.1768L39 27.2879L21.9713 36.7483C21.3672 37.0839 20.6328 37.0839 20.0287 36.7483L11.0287 31.7483C10.3938 31.3956 10 30.7263 10 30V20C10 19.2737 10.3938 18.6044 11.0287 18.2517L20.0287 13.2517Z"
        fill="white"
      />
    </SvgIcon>
  );
};
