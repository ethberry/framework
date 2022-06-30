import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ITemplate } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";
import { formatPrice } from "../../../../utils/money";
import { Erc998ItemTemplateBuyButton } from "../../../../components/buttons";

interface ITemplateItemProps {
  template: ITemplate;
}

export const TemplateItem: FC<ITemplateItemProps> = props => {
  const { template } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-templates/${template.id}`}>
        <CardMedia className={classes.media} image={template.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {template.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={template.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(template.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Erc998ItemTemplateBuyButton template={template} />
        </Grid>
      </CardActions>
    </Card>
  );
};
