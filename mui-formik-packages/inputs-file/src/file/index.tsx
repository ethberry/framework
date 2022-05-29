import { FC, useCallback } from "react";
import clsx from "clsx";
import { useDropzone, FileRejection, DropzoneOptions } from "react-dropzone";
import { CloudUpload, CloudUploadOutlined, CloudOff } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";

import { ACCEPTED_FORMATS, MAX_FILE_SIZE, MIN_FILE_SIZE } from "./constants";
import { humanFileSize } from "./utils";
import { useStyles } from "./styles";

export interface IFileInputProps extends DropzoneOptions {
  classes?: {
    root?: string;
    active?: string;
    inactive?: string;
    disabled?: string;
  };
  onChange: (files: Array<File>) => void;
}

export const FileInput: FC<IFileInputProps> = props => {
  const {
    disabled,
    onChange,
    accept = ACCEPTED_FORMATS,
    minSize = MIN_FILE_SIZE,
    maxSize = MAX_FILE_SIZE,
    ...rest
  } = props;
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const form = useFormContext<any>();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    console.info("acceptedFiles", acceptedFiles);
    console.info("rejectedFiles", rejectedFiles);

    if (rejectedFiles.length) {
      rejectedFiles.forEach(rejectedFile => {
        console.info("rejectedFile", rejectedFile);
        rejectedFile.errors.forEach(({ code }) => {
          console.info("code", code);
          console.info("accept", accept);
          enqueueSnackbar(
            formatMessage(
              { id: `components.dropzone.${code}` },
              {
                // chrome does not report filetype on drag&drop
                type: rejectedFile.file.type || `.${rejectedFile.file.name.split(".").pop() || ""}` || "UNKNOWN",
                accept: ([] as Array<string>).concat(...Object.values(accept)).join(", "),
                size: humanFileSize(rejectedFile.file.size),
                minSize: humanFileSize(minSize),
                maxSize: humanFileSize(maxSize),
              },
            ),
            { variant: "error" },
          );
        });
      });
    }

    if (acceptedFiles.length) {
      console.info("acceptedFiles", acceptedFiles);
      onChange(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    minSize,
    maxSize,
    ...rest,
  });

  if (disabled) {
    return (
      <div className={clsx(classes.placeholder, props.classes?.root)}>
        <CloudOff className={clsx(classes.icon, props.classes?.disabled)} />
      </div>
    );
  }

  return (
    <div {...getRootProps()} className={clsx(classes.placeholder, props.classes?.root)}>
      <Controller
        name="file"
        control={form.control}
        render={({ field }) => <input {...getInputProps()} {...field} />}
      />
      {isDragActive ? (
        <CloudUploadOutlined className={clsx(classes.icon, props.classes?.active)} />
      ) : (
        <CloudUpload className={clsx(classes.icon, props.classes?.inactive)} />
      )}
    </div>
  );
};
