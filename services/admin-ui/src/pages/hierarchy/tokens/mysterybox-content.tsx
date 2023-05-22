import { FC } from "react";
import { Grid, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IMysterybox, TokenType } from "@framework/types";

import { formatEther } from "../../../utils/money";

export interface IMysteryboxContentProps {
  mysterybox?: IMysterybox;
}

export const MysteryboxContent: FC<IMysteryboxContentProps> = props => {
  const { mysterybox } = props;

  if (!mysterybox) {
    return null;
  }

  return (
    <Grid container>
      {mysterybox.item?.components.map(component => (
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
