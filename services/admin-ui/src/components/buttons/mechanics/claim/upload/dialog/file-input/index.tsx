import React, { FC, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import csv2json from "csvtojson";
import { v4 } from "uuid";

import { FileInput as AbstractFileInput } from "@gemunion/mui-inputs-file";

import { IClaimRow } from "../../index";
import { claimsValidationSchema } from "../validation";
import { ClaimsView } from "../view";
import { useStyles } from "./styles";

export interface IClaimUploadDto {
  claims: Array<IClaimRow>;
}

export const FileInput: FC = () => {
  const classes = useStyles();
  const form = useFormContext<any>();
  const claims = useWatch({ name: "claims" });

  const { formatMessage } = useIntl();
  const [isValid, setIsValid] = useState<boolean>(true);

  const headers = ["account", "endTimestamp", "tokenType", "contractId", "templateId", "amount"];

  const resetForm = () => {
    setIsValid(true);
    form.reset({ claims: [] });
  };

  const parseCsv = async (csv: File): Promise<IClaimRow[]> => {
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
          .then((data: IClaimRow[]) => {
            resolve(data.map(claim => ({ ...claim, id: v4() })));
          });
      };
      reader.readAsText(csv, "UTF-8");
    });
  };

  const handleChange = async (files: Array<File>) => {
    setIsValid(true);
    try {
      const data = await parseCsv(files[0]);
      claimsValidationSchema.validateSync({ claims: data });
      form.setValue("claims", data, { shouldDirty: true });
    } catch (e) {
      console.error(e);
      form.reset();
      setIsValid(false);
    }
  };

  useEffect(() => {
    return () => resetForm();
  }, []);

  if (claims.length) {
    return <ClaimsView resetForm={resetForm} />;
  }

  return (
    <>
      <AbstractFileInput
        name="files"
        onChange={handleChange}
        classes={classes}
        minSize={0}
        accept={{
          "text/csv": [".csv"],
        }}
      />
      {!isValid ? (
        <FormHelperText error sx={{ ml: 0 }}>
          <FormattedMessage
            id="form.validations.badInput"
            values={{ label: formatMessage({ id: "form.labels.files" }) }}
          />
        </FormHelperText>
      ) : null}
    </>
  );
};
