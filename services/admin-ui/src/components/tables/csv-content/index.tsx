import React, { FC } from "react";
import { Box, Button } from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { Clear } from "@mui/icons-material";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";

export interface ICsvContentViewProps {
  resetForm: () => void;
  csvContentName: string;
  columns: GridColDef[];
}

export const CsvContentView: FC<ICsvContentViewProps> = props => {
  const { columns, csvContentName, resetForm } = props;

  const csvContent = useWatch({ name: csvContentName });
  const form = useFormContext<any>();

  const handleRowOrderChange = (event: any) => {
    const { oldIndex, targetIndex } = event;
    const newCsvContent = [...csvContent];
    const row = newCsvContent.splice(oldIndex, 1)[0];
    newCsvContent.splice(targetIndex, 0, row);
    form.setValue(csvContentName, newCsvContent, { shouldDirty: true });
  };

  const ResetButton = () => (
    <Button
      variant="outlined"
      startIcon={<Clear fontSize="inherit" />}
      onClick={resetForm}
      data-testid="ResetFormButton"
    >
      <FormattedMessage id="form.buttons.reset" />
    </Button>
  );

  return (
    <Box sx={{ height: 440 }}>
      <DataGridPremium
        rowCount={csvContent.length}
        columns={columns}
        rows={csvContent}
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
