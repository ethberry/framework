import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IErc721Dropbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { Erc721DropboxTemplateBuyButton } from "../../../../components/buttons";
import { formatMoney } from "../../../../utils/money";
import { useStyles } from "./styles";

interface IErc721DropboxItemProps {
  dropbox: IErc721Dropbox;
}

export const DropboxItem: FC<IErc721DropboxItemProps> = props => {
  const { dropbox } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-dropboxes/${dropbox.id}`}>
        <CardMedia className={classes.media} image={dropbox.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {dropbox.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={dropbox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatMoney(dropbox.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Erc721DropboxTemplateBuyButton dropbox={dropbox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
