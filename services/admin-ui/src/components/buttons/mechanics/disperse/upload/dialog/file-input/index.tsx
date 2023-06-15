import React, { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import csv2json from "csvtojson";
import { v4 } from "uuid";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";

import { IDisperseRow } from "../../index";
import { IDisperseUploadDto } from "../index";
import { CsvContentView } from "../../../../../../tables/csv-content";
import { dispersesValidationSchema } from "../validation";
import { useStyles } from "./styles";

export interface IFileInputProps {
  initialValues: IDisperseUploadDto;
}

export const FileInput: FC<IFileInputProps> = props => {
  const { initialValues } = props;
  const classes = useStyles();

  const dispersesName = "disperses";
  const filesName = "files";

  const { formatMessage } = useIntl();
  const disperses = useWatch({ name: dispersesName });
  const form = useFormContext<any>();

  const headers = ["account", "tokenType", "address", "tokenId", "amount"];

  const resetForm = () => {
    form.reset(initialValues);
  };

  const parseCsv = async (csv: File): Promise<IDisperseRow[]> => {
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
          .then((data: IDisperseRow[]) => {
            resolve(data.map(disperse => ({ ...disperse, id: v4() })));
          });
      };
      reader.readAsText(csv, "UTF-8");
    });
  };

  const handleChange = async (files: Array<File>) => {
    try {
      const data = await parseCsv(files[0]);
      dispersesValidationSchema.validateSync({ [dispersesName]: data });
      form.setValue(dispersesName, data, { shouldDirty: true });
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

  if (disperses.length) {
    return <CsvContentView resetForm={resetForm} csvContentName={dispersesName} columns={columns} />;
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
