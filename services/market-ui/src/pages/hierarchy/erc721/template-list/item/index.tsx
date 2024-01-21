import { FC } from "react";
import { CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatItem } from "@framework/exchange";
import { StyledCardContentDescription, StyledCardMedia, StyledTemplateItemCard } from "@framework/styled";
import type { ITemplate } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { TemplatePurchaseButton } from "../../../../../components/buttons";
import { StyledSvgIcon } from "../../../../../components/common/header/network/styled";
import { getChainIconParams } from "../../../../../components/common/header/network/utils";

interface IErc721TemplateListItemProps {
  template: ITemplate;
}

export const Erc721TemplateListItem: FC<IErc721TemplateListItemProps> = props => {
  const { template } = props;

  const { chainIcon, viewBox } = getChainIconParams(template.contract?.chainId || 56);

  return (
    <StyledTemplateItemCard>
      <CardActionArea component={RouterLink} to={`/erc721/templates/${template.id}`}>
        <CardHeader title={template.title} />
        <StyledCardMedia height={140} image={template.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={template.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatItem(template.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container spacing={3} justifyContent="space-between" alignItems="flex-end">
          <Grid item xs={10} alignItems="center">
            <TemplatePurchaseButton template={template} />
          </Grid>
          <Grid item xs={2} alignItems="flex-end">
            <StyledSvgIcon component={chainIcon} viewBox={viewBox} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledTemplateItemCard>
  );
};
