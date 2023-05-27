import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";
import { useStyles } from "./styles";

export const FileInput: FC = () => {
  const form = useFormContext<any>();
  const classes = useStyles();

  const handleChange = (files: Array<File>): void => {
    form.setValue("files", files, { shouldTouch: true, shouldDirty: true });
  };

  return (
    <AbstractFileInput
      name="files"
      onChange={handleChange}
      classes={classes}
      minSize={0}
      accept={{
        "text/csv": [".csv"],
      }}
    />
  );
};
