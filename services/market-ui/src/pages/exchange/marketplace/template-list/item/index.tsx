import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { RichTextDisplay } from "@gemunion/mui-rte";
import type { ITemplate } from "@framework/types";

import { TemplatePurchaseButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";

interface IErc721TemplateListItemProps {
  template: ITemplate;
}

export const TemplateListItem: FC<IErc721TemplateListItemProps> = props => {
  const { template } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/marketplace/templates/${template.id}`}>
        <CardHeader title={template.title} />
        <CardMedia sx={{ height: 140 }} image={template.imageUrl} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" sx={{ height: 80, overflow: "hidden" }}>
            <RichTextDisplay data={template.description} />
          </Typography>
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