import { FC } from "react";
import { Avatar, CircularProgress } from "@mui/material";

import { IToken } from "../../../../provider";

export interface ITokenAvatarProps {
  size: number;
  token: IToken;
}

export const TokenAvatar: FC<ITokenAvatarProps> = props => {
  const { token, size } = props;

  if (!token) {
    return <CircularProgress sx={{ width: size, height: size }} />;
  }

  return <Avatar alt={token.symbol} src={token.logoURI} sx={{ width: size, height: size }} />;
};
