import React, { FC } from "react";
import { Box, Button } from "@mui/material";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { Clear } from "@mui/icons-material";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

export interface IClaimsViewProps {
  resetForm: () => void;
}

export const ClaimsView: FC<IClaimsViewProps> = props => {
  const { resetForm } = props;

  const claims = useWatch({ name: "claims" });
  const form = useFormContext<any>();
  const { formatMessage } = useIntl();

  const columns = [
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: true,
      flex: 3,
      minWidth: 260,
    },
    {
      field: "endTimestamp",
      headerName: formatMessage({ id: "form.labels.endTimestamp" }),
      sortable: true,
      flex: 2,
      minWidth: 180,
    },
    {
      field: "tokenType",
      headerName: formatMessage({ id: "form.labels.token" }),
      sortable: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "contractId",
      headerName: formatMessage({ id: "form.labels.contractId" }),
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
  ];

  const handleRowOrderChange = (event: any) => {
    const { oldIndex, targetIndex } = event;
    const newClaims = [...claims];
    const row = newClaims.splice(oldIndex, 1)[0];
    newClaims.splice(targetIndex, 0, row);
    form.setValue("claims", newClaims, { shouldDirty: true });
  };

  const ResetButton = () => (
    <Button startIcon={<Clear fontSize="inherit" />} onClick={resetForm} data-testid="ResetFormButton">
      <FormattedMessage id="form.buttons.reset" />
    </Button>
  );

  return (
    <Box sx={{ height: 500 }}>
      <DataGridPremium
        rowCount={claims.length}
        columns={columns}
        rows={claims}
        rowReordering
        density="compact"
        onRowOrderChange={handleRowOrderChange}
        slots={{
          toolbar: ResetButton,
        }}
      />
    </Box>
  );
};
