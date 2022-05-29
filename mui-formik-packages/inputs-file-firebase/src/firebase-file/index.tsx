import { FC } from "react";

import { FileInput, IFileInputProps } from "@gemunion/mui-inputs-file";
import { useUploadUrl } from "./utils";

export interface IFirebaseFileInputProps extends Omit<IFileInputProps, "onChange"> {
  bucket?: string;
  onChange: (urls: Array<string>) => void;
}

export const FirebaseFileInput: FC<IFirebaseFileInputProps> = props => {
  const { onChange, bucket, ...rest } = props;

  const uploadUrl = useUploadUrl(bucket);

  const handleChange = async (files: File[]): Promise<void> => {
    onChange(await uploadUrl(files));
  };

  return <FileInput onChange={handleChange} {...rest} />;
};
