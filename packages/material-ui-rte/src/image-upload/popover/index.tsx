import React, {FC, useEffect, useState} from "react";

import {Popover, Button, Grid} from "@material-ui/core";
import {Done, Close} from "@material-ui/icons";
import {FirebaseFileInput} from "@trejgun/material-ui-inputs-file-firebase";

import useStyles from "./styles";

type TMyCardData = {
  urls?: Array<string>;
};

type TAnchor = HTMLElement | null;

interface IMyCardPopoverProps {
  anchor: TAnchor;
  onSubmit: (data: TMyCardData, insert: boolean) => void;
}

type TMyCardPopoverState = {
  anchor: TAnchor;
  isCancelled: boolean;
};

export const ImageUploadPopover: FC<IMyCardPopoverProps> = props => {
  const classes = useStyles();
  const [state, setState] = useState<TMyCardPopoverState>({
    anchor: null,
    isCancelled: false,
  });
  const [data, setData] = useState<TMyCardData>({});

  useEffect(() => {
    setState({
      anchor: props.anchor,
      isCancelled: false,
    });
  }, [props.anchor]);

  const handleChange = (urls: Array<string>) => {
    setData({urls});
    setState({
      anchor: null,
      isCancelled: false,
    });
  };

  const textFieldProps = {
    className: classes.textField,
    onChange: handleChange,
    InputLabelProps: {
      shrink: true,
    },
  };

  return (
    <Popover
      anchorEl={state.anchor}
      open={state.anchor !== null}
      onExited={() => {
        props.onSubmit(data, !state.isCancelled);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={12}>
          <FirebaseFileInput {...textFieldProps} classes={{}} />
        </Grid>
        <Grid item container xs={12} justify="flex-end">
          <Button
            onClick={() => {
              setState({
                anchor: null,
                isCancelled: true,
              });
            }}
          >
            <Close />
          </Button>
          <Button
            onClick={() => {
              setState({
                anchor: null,
                isCancelled: false,
              });
            }}
          >
            <Done />
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
};
