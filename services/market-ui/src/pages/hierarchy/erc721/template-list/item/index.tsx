import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

interface IErc721TemplateListItemProps {
  template: ITemplate;
}

export const Erc721TemplateListItem: FC<IErc721TemplateListItemProps> = props => {
  const { template } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721/templates/${template.id}`}>
        <CardHeader title={template.title} />
        <StyledCardMedia height={140} image={template.imageUrl} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={template.description} />
          </StyledCardContentDescription>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(template.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <TemplatePurchaseButton template={template} />
        </Grid>
      </CardActions>
    </Card>
  );
};
