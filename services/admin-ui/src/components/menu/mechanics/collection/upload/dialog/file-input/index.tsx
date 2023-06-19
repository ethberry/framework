import React, { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { v4 } from "uuid";
import csv2json from "csvtojson";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";

import { CsvContentView } from "../../../../../../tables/csv-content";
import { ICollectionUploadDto } from "../index";
import { tokensValidationSchema } from "../validation";
import { useStyles } from "./styles";
// TODO this is wrong
import { IClaimRow } from "../../../../../../buttons/mechanics/claim/upload/dialog/file-input";

export interface IFileInputProps {
  initialValues: ICollectionUploadDto;
}

export const FileInput: FC<IFileInputProps> = props => {
  const { initialValues } = props;

  const classes = useStyles();
  const form = useFormContext<any>();
  const { formatMessage } = useIntl();

  const fieldName = "tokens";
  const filesName = "files";

  const tokens = useWatch({ name: fieldName });

  const headers = ["tokenId", "imageUrl", "metadata"];

  const resetForm = () => {
    form.reset(initialValues);
  };

  const parseCsv = async (csv: File): Promise<IClaimRow[]> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = function fileReadCompleted() {
        void csv2json({
          noheader: true,
          headers,
          colParser: {
            metadata: "string",
          },
          checkType: true,
        })
          .fromString(reader.result as string)
          .then((data: IClaimRow[]) => {
            resolve(data.map(token => ({ ...token, id: v4() })));
          });
      };
      reader.readAsText(csv, "UTF-8");
    });
  };

  const handleChange = async (files: Array<File>) => {
    try {
      const data = await parseCsv(files[0]);
      tokensValidationSchema.validateSync({ [fieldName]: data });
      form.setValue(fieldName, data, { shouldDirty: true });
      form.setValue(filesName, files, { shouldDirty: true });
    } catch (e) {
      console.error(e);
      form.reset(initialValues);
      form.setError(filesName, { type: "custom", message: "form.validations.badInput" });
    }
  };

  const columns = [
    {
      field: "tokenId",
      headerName: formatMessage({ id: "form.labels.tokenId" }),
      sortable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "imageUrl",
      headerName: formatMessage({ id: "form.labels.imageUrl" }),
      sortable: true,
      flex: 3,
      minWidth: 260,
    },
    {
      field: "metadata",
      headerName: formatMessage({ id: "form.labels.metadata" }),
      sortable: true,
      flex: 2,
      minWidth: 260,
    },
  ];

  useEffect(() => {
    return () => resetForm();
  }, []);

  if (tokens.length) {
    return <CsvContentView resetForm={resetForm} csvContentName={fieldName} columns={columns} />;
  }

  return (
    <AbstractFileInput
      name={filesName}
      onChange={handleChange}
      classes={classes}
      minSize={0}
      accept={{
        "text/csv": [".csv"],
      }}
    />
  );
};
