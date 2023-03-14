import { FC, MouseEvent, useState } from "react";

import { Box, IconButton, Popover, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Help } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

export const BlockchainInfoPopover: FC<Record<string, any>> = props => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "contract-info" : undefined;

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
        <Table sx={{ minWidth: 650 }} aria-label="contract parameters">
          <TableBody>
            {Object.keys(props).map(key => (
              <TableRow key={key}>
                <TableCell>
                  <FormattedMessage id={`form.labels.${key}`} />
                </TableCell>
                <TableCell>{Array.isArray(props[key]) ? props[key].join(", ") || "—" : props[key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Popover>
    </Box>
  );
};
