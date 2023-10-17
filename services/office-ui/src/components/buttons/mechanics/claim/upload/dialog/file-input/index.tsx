import React, { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import csv2json from "csvtojson";
import { v4 } from "uuid";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";
import type { IClaimRowDto, IClaimUploadDto } from "@framework/types";

import { CsvContentView } from "../../../../../../tables/csv-content";
import { claimsValidationSchema } from "../validation";
import { useStyles } from "./styles";

export interface IFileInputProps {
  initialValues: IClaimUploadDto;
}

export const FileInput: FC<IFileInputProps> = props => {
  const { initialValues } = props;
  const classes = useStyles();

  const fieldName = "claims";
  const filesName = "files";

  const form = useFormContext<any>();
  const claims = useWatch({ name: fieldName });
  const { formatMessage } = useIntl();

  const headers = ["account", "tokenType", "address", "templateId", "amount", "endTimestamp"];

  const resetForm = () => {
    form.reset(initialValues);
  };

  const parseCsv = async (csv: File): Promise<Array<IClaimRowDto>> => {
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
          .then((data: IClaimRowDto[]) => {
            resolve(data.map(claim => ({ ...claim, id: v4() })));
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
      minWidth: 80,
    },
    {
      field: "templateId",
      headerName: formatMessage({ id: "form.labels.templateId" }),
      sortable: true,
      flex: 1,
      minWidth: 80,
    },
    {
      field: "amount",
      headerName: formatMessage({ id: "form.labels.amount" }),
      sortable: true,
      flex: 2,
      minWidth: 200,
    },
    {
      field: "endTimestamp",
      headerName: formatMessage({ id: "form.labels.endTimestamp" }),
      sortable: true,
      flex: 2,
      minWidth: 180,
    },
  ];

  useEffect(() => {
    return () => resetForm();
  }, []);

  if (claims.length) {
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
