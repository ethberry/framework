import { FC, MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";

export const AllowanceInfoPopover: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton
        aria-owns={open ? "allowance-info" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Help />
      </IconButton>
      <Popover
        id={"allowance-info"}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        sx={{
          pointerEvents: "none",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          <FormattedMessage id="alert.approve" />
        </Typography>
      </Popover>
    </Box>
  );
};