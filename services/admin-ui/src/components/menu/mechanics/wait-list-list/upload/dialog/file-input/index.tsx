import React, { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import csv2json from "csvtojson";
import { v4 } from "uuid";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";

import { CsvContentView } from "../../../../../../tables/csv-content";
import { claimsValidationSchema } from "../validation";
import { useStyles } from "./styles";

export interface IWaitListRow {
  id?: string;
  account: string;
}

export interface IWaitListUploadDto {
  listId: number;
  items: Array<IWaitListRow>;
}

export interface IFileInputProps {
  initialValues: IWaitListUploadDto;
}

export const FileInput: FC<IFileInputProps> = props => {
  const { initialValues } = props;
  const classes = useStyles();

  const fieldName = "items";
  const filesName = "files";

  const form = useFormContext<any>();
  const items = useWatch({ name: fieldName });
  const { formatMessage } = useIntl();

  const headers = ["account"];

  const resetForm = () => {
    form.reset(initialValues);
  };

  const parseCsv = async (csv: File): Promise<IWaitListRow[]> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = function fileReadCompleted() {
        void csv2json({
          noheader: true,
          headers,
          colParser: {
            amount: "string",
          },
          checkType: true,
        })
          .fromString(reader.result as string)
          .then((data: IWaitListRow[]) => {
            resolve(data.map(items => ({ ...items, id: v4() })));
          });
      };
      reader.readAsText(csv, "UTF-8");
    });
  };

  const handleChange = async (files: Array<File>) => {
    try {
      const data = await parseCsv(files[0]);
      claimsValidationSchema.validateSync({ [fieldName]: data });
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
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: true,
      flex: 3,
      minWidth: 260,
    },
  ];

  useEffect(() => {
    return () => resetForm();
  }, []);

  if (items.length) {
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
