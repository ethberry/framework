import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export interface IBreadcrumbsProps {
  path: Array<string>;
}

export const Breadcrumbs: FC<IBreadcrumbsProps> = props => {
  const { path } = props;
  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {path.map((e, i) => {
        if (i === path.length - 1) {
          return (
            <Typography color="textPrimary" key={i}>
              <FormattedMessage id={`pages.${e}.title`} />
            </Typography>
          );
        }
        return (
          <Link color="inherit" component={RouterLink} to={`/${e}`} key={i}>
            <FormattedMessage id={`pages.${e}.title`} />
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
