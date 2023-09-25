import { FC, MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Box, IconButton } from "@mui/material";
import { Help } from "@mui/icons-material";

import { StyledPopover, StyledText } from "./styled";

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
      <StyledPopover
        id={"allowance-info"}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
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
        <StyledText>
          <FormattedMessage id="alert.approve" />
        </StyledText>
      </StyledPopover>
    </Box>
  );
};
