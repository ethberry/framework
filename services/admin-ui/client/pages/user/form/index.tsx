import React, {FC} from "react";
import {Collapse, Grid} from "@material-ui/core";

import {AutoSave, FormikForm} from "@gemunionstudio/material-ui-form";
import {UserRole, UserStatus} from "@gemunionstudio/framework-types";
import {SelectInput, SearchInput} from "@gemunionstudio/material-ui-inputs-core";

import useStyles from "./styles";
import {IUserSearchDto} from "../index";

interface IUserSearchFormProps {
  onSubmit: (values: IUserSearchDto) => void;
  initialValues: IUserSearchDto;
  open: boolean;
}

export const UserSearchForm: FC<IUserSearchFormProps> = props => {
  const {onSubmit, initialValues, open} = props;

  const classes = useStyles();

  const {query, userStatus, userRoles} = initialValues;
  const fixedValues = {query, userStatus, userRoles};

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
