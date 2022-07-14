import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IDropbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { DropboxBuyButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";

interface IDropboxItemProps {
  dropbox: IDropbox;
}

export const DropboxItem: FC<IDropboxItemProps> = props => {
  const { dropbox } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/dropboxes/${dropbox.id}`}>
        <CardMedia className={classes.media} image={dropbox.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {dropbox.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={dropbox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatPrice(dropbox.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <DropboxBuyButton dropbox={dropbox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
