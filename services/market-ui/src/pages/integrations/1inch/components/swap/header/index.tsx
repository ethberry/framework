import { FC, useState } from "react";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Replay, Tune } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { AdvancedSettingsDialog } from "../advanced-settings";

import { useStyles } from "./styles";

export interface ISwapHeaderProps {
  onReset: () => void;
}

export const SwapHeader: FC<ISwapHeaderProps> = props => {
  const { onReset } = props;

  const classes = useStyles();

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
    <Toolbar className={classes.toolbar}>
      <IconButton onClick={handleReset}>
        <Replay />
      </IconButton>

      <Box className={classes.title}>
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
