import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IUserSearchDto, UserRole, UserStatus } from "@framework/types";

interface IUserSearchFormProps {
  onSubmit: (values: IUserSearchDto) => Promise<void>;
  initialValues: IUserSearchDto;
  open: boolean;
}

export const UserSearchForm: FC<IUserSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, userStatus, userRoles } = initialValues;
  const fixedValues = { query, userStatus, userRoles };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="UserSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput multiple name="userStatus" options={UserStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="userRoles" options={UserRole} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
