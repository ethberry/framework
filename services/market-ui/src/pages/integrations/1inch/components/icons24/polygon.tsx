import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const Polygon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#8247E5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.01148 5.30063C8.25312 5.16639 8.54688 5.16639 8.78852 5.30063L12.3885 7.30063C12.6425 7.44171 12.8 7.70943 12.8 7.99995V9.30063L11.2 10.2V8.47067L8.4 6.91511L5.6 8.47067V11.5292L8.4 13.0848L15.2115 9.30063C15.4531 9.16639 15.7469 9.16639 15.9885 9.30063L19.5885 11.3006C19.8425 11.4417 20 11.7094 20 12V16C20 16.2905 19.8425 16.5582 19.5885 16.6993L15.9885 18.6993C15.7469 18.8335 15.4531 18.8335 15.2115 18.6993L11.6115 16.6993C11.3575 16.5582 11.2 16.2905 11.2 16V14.6993L12.8 13.8V15.5292L15.6 17.0848L18.4 15.5292V12.4707L15.6 10.9151L8.78852 14.6993C8.54688 14.8335 8.25312 14.8335 8.01148 14.6993L4.41148 12.6993C4.15752 12.5582 4 12.2905 4 12V7.99995C4 7.70943 4.15752 7.44171 4.41148 7.30063L8.01148 5.30063Z"
        fill="white"
      />
    </SvgIcon>
  );
};
