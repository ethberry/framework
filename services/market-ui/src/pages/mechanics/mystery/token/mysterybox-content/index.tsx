import { FC } from "react";
import { Grid, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import type { IMysteryBox } from "@framework/types";
import { TokenType } from "@framework/types";

import { formatEther } from "../../../../../utils/money";
import { StyledPaper, StyledTitle } from "./styled";

export interface IMysteryBoxContentProps {
  mysteryBox: IMysteryBox;
}

export const MysteryBoxContent: FC<IMysteryBoxContentProps> = props => {
  const { mysteryBox } = props;

  if (!mysteryBox) {
    return null;
  }

  return (
    <>
      <StyledTitle variant="h5">
        <FormattedMessage id="pages.mystery.box.content" />
      </StyledTitle>
      <StyledPaper elevation={1}>
        <Grid container>
          <Grid xs={4} item>
            <Typography fontWeight={450}>
              <FormattedMessage id="form.labels.tokenType" />
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography fontWeight={450}>
              <FormattedMessage id="form.labels.template" />
            </Typography>
          </Grid>
          <Grid xs={4} item>
            <Typography fontWeight={450}>
              <FormattedMessage id="form.labels.amount" />
            </Typography>
          </Grid>
        </Grid>
        {mysteryBox.item?.components.map(component => (
          <Grid key={component.id} container>
            <Grid xs={4} item>
              {component.tokenType}
            </Grid>
            <Grid xs={4} item>
              {component.tokenType !== TokenType.ERC20 ? (
                <Link
                  component={RouterLink}
                  to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId as number}`}
                >
                  {component.template!.title}
                </Link>
              ) : (
                component.template!.title
              )}
            </Grid>
            <Grid xs={4} item>
              {formatEther(component.amount, component.contract!.decimals, "")}
            </Grid>
          </Grid>
        ))}
      </StyledPaper>
    </>
  );
};
