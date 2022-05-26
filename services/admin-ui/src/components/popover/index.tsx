import { FC, MouseEvent, useState } from "react";

import { IconButton, Popover, Table, TableRow, TableCell, TableBody } from "@mui/material";
import { QuestionMark } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export const BlockchainInfoPopover: FC<Record<string, string | number>> = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "blockchain-info" : undefined;

  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick} className={classes.button}>
        <QuestionMark />
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {Object.keys(props).map(key => (
              <TableRow key={key}>
                <TableCell>
                  <FormattedMessage id={`form.labels.${key}`} />
                </TableCell>
                <TableCell>{props[key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Popover>
    </>
  );
};
