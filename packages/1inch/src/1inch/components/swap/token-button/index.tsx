import { FC } from "react";
import { Box, Button } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

import type { IToken } from "../../../provider";

import { TokenAvatar } from "./token-avatar";

export interface ISwapTokenProps {
  token: IToken;
  onClick: () => void;
}

export const TokenButton: FC<ISwapTokenProps> = props => {
  const { token, onClick } = props;

  return (
    <Button
      onClick={onClick}
      startIcon={<TokenAvatar size={34} token={token} />}
      endIcon={<KeyboardArrowDown />}
      variant="outlined"
      fullWidth
    >
      {token?.symbol}
      <Box style={{ flexGrow: 1 }} />
    </Button>
  );
};
