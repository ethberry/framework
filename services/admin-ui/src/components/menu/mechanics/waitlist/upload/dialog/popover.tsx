import { FC, MouseEvent, useState } from "react";

import { Box, IconButton, Popover, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";

export const WaitListInfoPopover: FC<Record<string, string | number>> = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "claim-info" : undefined;

  return (
    <Box sx={{ zIndex: 1000 }}>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Help />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, overflowX: "scroll" }}>
          <Typography>Format: </Typography>
          <pre>account,listId</pre>
          <Typography>Example: </Typography>
          <pre>
            0xfe3b557e8fb62b89f4916b721be55ceb828dbd73,1
            <br />
          </pre>
        </Box>
      </Popover>
    </Box>
  );
};
