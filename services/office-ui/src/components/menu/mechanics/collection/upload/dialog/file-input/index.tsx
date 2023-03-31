import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";
import { useStyles } from "./styles";

export const FileInput: FC = () => {
  const form = useFormContext<any>();
  const classes = useStyles();

  const handleChange = (files: Array<File>): void => {
    form.setValue("files", files, { shouldTouch: true });
  };

  // const [files, setFiles] = useState<any>([]);
  //
  // const onDropAccepted = (files: any) => {
  //   setFiles(files);
  // };

  return (
    <AbstractFileInput
      name="files"
      onChange={handleChange}
      // onDropAccepted={onDropAccepted}
      classes={classes}
      minSize={0}
      accept={{
        "text/csv": [".csv"],
      }}
    />
  );
};
