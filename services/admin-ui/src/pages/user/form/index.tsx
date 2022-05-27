import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormikForm } from "@gemunion/mui-form";
import { IUserSearchDto, UserRole, UserStatus } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IUserSearchFormProps {
  onSearch: (values: IUserSearchDto) => void;
  initialValues: IUserSearchDto;
  open: boolean;
}

export const UserSearchForm: FC<IUserSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, userStatus, userRoles } = initialValues;
  const fixedValues = { query, userStatus, userRoles };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="UserSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput multiple name="userStatus" options={UserStatus} onSearch={onSearch} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="userRoles" options={UserRole} onSearch={onSearch} />
          </Grid>
        </Grid>
      </Collapse>
    </FormikForm>
  );
};
