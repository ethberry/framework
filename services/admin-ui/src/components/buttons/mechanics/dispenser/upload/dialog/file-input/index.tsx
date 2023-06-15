import React, { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import csv2json from "csvtojson";
import { v4 } from "uuid";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";

import { IDispenserRow } from "../../index";
import { IDispenserUploadDto } from "../index";
import { CsvContentView } from "../../../../../../tables/csv-content";
import { dispenserValidationSchema } from "../validation";
import { useStyles } from "./styles";

export interface IFileInputProps {
  initialValues: IDispenserUploadDto;
}

export const FileInput: FC<IFileInputProps> = props => {
  const { initialValues } = props;
  const classes = useStyles();

  const rowsName = "rows";
  const filesName = "files";

  const { formatMessage } = useIntl();
  const rows = useWatch({ name: rowsName });
  const form = useFormContext<any>();

  const headers = ["account", "tokenType", "address", "tokenId", "amount"];

  const resetForm = () => {
    form.reset(initialValues);
  };

  const parseCsv = async (csv: File): Promise<IDispenserRow[]> => {
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
          .then((data: IDispenserRow[]) => {
            resolve(data.map(row => ({ ...row, id: v4() })));
          });
      };
      reader.readAsText(csv, "UTF-8");
    });
  };

  const handleChange = async (files: Array<File>) => {
    try {
      const data = await parseCsv(files[0]);
      dispenserValidationSchema.validateSync({ [rowsName]: data });
      form.setValue(rowsName, data, { shouldDirty: true });
      form.setValue(filesName, files, { shouldDirty: true });
    } catch (e) {
      console.error(e);
      form.reset(initialValues);
      form.setError(filesName, { type: "custom", message: "form.validations.badInput" });
    }
  };

  useEffect(() => {
    return () => resetForm();
  }, []);

  const columns = [
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: true,
      flex: 3,
      minWidth: 260,
    },
    {
      field: "tokenType",
      headerName: formatMessage({ id: "form.labels.tokenType" }),
      sortable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "address",
      headerName: formatMessage({ id: "form.labels.address" }),
      sortable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "tokenId",
      headerName: formatMessage({ id: "form.labels.tokenId" }),
      sortable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "amount",
      headerName: formatMessage({ id: "form.labels.amount" }),
      sortable: true,
      flex: 2,
      minWidth: 200,
    },
  ];

  if (rows.length) {
    return <CsvContentView resetForm={resetForm} csvContentName={rowsName} columns={columns} />;
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
