import { FC } from "react";
import { CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { formatItem } from "@framework/exchange";
import { StyledCardContentDescription, StyledCardMedia, StyledTemplateItemCard } from "@framework/styled";
import type { ITemplate } from "@framework/types";
import { RichTextDisplay } from "@ethberry/mui-rte";

import { TemplatePurchaseNowButton } from "../../../../../components/buttons";

interface IErc721TemplateListItemProps {
  template: ITemplate;
}

export const Erc721TemplateListItem: FC<IErc721TemplateListItemProps> = props => {
  const { template } = props;

  return (
    <StyledTemplateItemCard>
      <CardActionArea component={RouterLink} to={`/erc721/templates/${template.id}/view`}>
        <CardHeader title={template.title} />
        <StyledCardMedia image={template.imageUrl} />
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
          <Grid item xs={12} alignItems="center">
            <TemplatePurchaseNowButton template={template} />
          </Grid>
        </Grid>
      </CardActions>
    </StyledTemplateItemCard>
  );
};
