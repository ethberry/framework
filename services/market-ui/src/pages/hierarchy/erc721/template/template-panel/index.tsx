import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { CardActions, CardContent, Grid } from "@mui/material";

import { formatItemHtmlList } from "@framework/exchange";
import type { ITemplate } from "@framework/types";

import { PurchaseNowButton } from "../../../../../components/buttons";
import { StyledCard, StyledList, StyledToolbar, StyledTypography } from "./styled";

export interface ICommonTemplatePanelProps {
  template: ITemplate;
}

export const Erc721TemplatePanel: FC<ICommonTemplatePanelProps> = props => {
  const { template } = props;

  return (
    <StyledCard>
      <CardContent>
        <StyledToolbar disableGutters>
          <StyledTypography gutterBottom variant="h5" component="p">
            <FormattedMessage id="pages.erc721.template.price" />
          </StyledTypography>
        </StyledToolbar>
        <StyledList component="ul">{formatItemHtmlList(template.price)}</StyledList>
      </CardContent>
      <CardActions>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <PurchaseNowButton template={template} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledCard>
  );
};
