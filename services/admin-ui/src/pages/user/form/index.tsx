import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { UserRole, UserStatus, IUserSearchDto } from "@gemunion/framework-types";
import { SelectInput, SearchInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IUserSearchFormProps {
  onSubmit: (values: IUserSearchDto) => void;
  initialValues: IUserSearchDto;
  open: boolean;
}

export const UserSearchForm: FC<IUserSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, userStatus, userRoles } = initialValues;
  const fixedValues = { query, userStatus, userRoles };

  return (
    <div className={classes.root}>
      <FormikForm initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchInput name="query" />
          </Grid>
        </Grid>
        <Collapse in={open}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectInput multiple name="userStatus" options={UserStatus} />
            </Grid>
            <Grid item xs={6}>
              <SelectInput multiple name="userRoles" options={UserRole} />
            </Grid>
          </Grid>
        </Collapse>
        <AutoSave />
      </FormikForm>
    </div>
  );
};
