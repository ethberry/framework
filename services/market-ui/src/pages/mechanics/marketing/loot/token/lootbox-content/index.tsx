import { FC } from "react";
import { Grid, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { formatEther } from "@framework/exchange";
import type { ILootBox } from "@framework/types";
import { TokenType } from "@framework/types";

import { StyledPaper, StyledTitle } from "./styled";

export interface ILootBoxContentProps {
  lootBox: ILootBox;
}

export const LootBoxContent: FC<ILootBoxContentProps> = props => {
  const { lootBox } = props;

  if (!lootBox) {
    return null;
  }

  return (
    <>
      <StyledTitle variant="h5">
        <FormattedMessage id="pages.loot.box.content" />
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
        {lootBox.content?.components.map(component => (
          <Grid key={component.id} container>
            <Grid xs={4} item>
              {component.tokenType}
            </Grid>
            <Grid xs={4} item>
              {component.tokenType !== TokenType.ERC20 ? (
                <Link
                  component={RouterLink}
                  to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId!}`}
                >
                  {`${component.amount} x ${component.template?.title}`}
                </Link>
              ) : (
                component.template!.title
              )}
            </Grid>
            <Grid xs={4} item>
              {formatEther(component.amount, component.template!.contract!.decimals, "")}
            </Grid>
          </Grid>
        ))}
      </StyledPaper>
    </>
  );
};
