import { FC, MouseEvent, useState } from "react";

import { Box, IconButton, Popover, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";

export const CollectionInfoPopover: FC<Record<string, string | number>> = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "collection-info" : undefined;

  const sample = '1,https://firebasestorage.googleapis.com/v0/b/firebase.appspot.com/LOGO.png,{"TEMPLATE_ID":"130103"}';
  return (
    <Box position="absolute" right={16} top={16} zIndex="1000">
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
          <pre>tokenId,imageUrl,attributes</pre>
          <Typography>Example: </Typography>
          <pre>{sample}</pre>
        </Box>
      </Popover>
    </Box>
  );
};
// headers: ["tokenId", "imageUrl", "attributes"],
