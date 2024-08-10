import { FC } from "react";
import { Grid, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatEther } from "@framework/exchange";
import type { IMysteryBox } from "@framework/types";
import { TokenType } from "@framework/types";

export interface IMysteryboxContentProps {
  mysteryBox?: IMysteryBox;
}

export const MysteryBoxContent: FC<IMysteryboxContentProps> = props => {
  const { mysteryBox } = props;

  if (!mysteryBox) {
    return null;
  }

  return (
    <Grid container>
      {mysteryBox.item?.components.map(component => (
        <Grid key={component.id} container>
          <Grid xs={4} item>
            {component.tokenType}
          </Grid>
          <Grid xs={4} item>
            {component.tokenType !== TokenType.ERC20 ? (
              <Link
                component={RouterLink}
                to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId || 0}`}
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
    </Grid>
  );
};
