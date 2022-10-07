import { FC, useState } from "react";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Replay, Tune } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { AdvancedSettingsDialog } from "../advanced-settings";

export interface ISwapHeaderProps {
  onReset: () => void;
}

export const SwapHeader: FC<ISwapHeaderProps> = props => {
  const { onReset } = props;

  const [open, setOpen] = useState(false);

  const handleReset = () => {
    onReset();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Toolbar
      disableGutters
      sx={{
        width: "100%",
        minHeight: 5,
      }}
    >
      <IconButton onClick={handleReset}>
        <Replay />
      </IconButton>

      <Box
        sx={{
          margin: "0 auto",
          display: "flex",
        }}
      >
        <Typography variant="h6">
          <FormattedMessage id="pages.1inch.swap.title" />
        </Typography>
      </Box>

      <IconButton onClick={handleOpen}>
        <Tune />
      </IconButton>
      <AdvancedSettingsDialog open={open} onClose={handleClose} />
    </Toolbar>
  );
};
