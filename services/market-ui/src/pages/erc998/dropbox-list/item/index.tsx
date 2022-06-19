import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { IErc998Dropbox } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { Erc998DropboxTemplateBuyButton } from "../../../../components/buttons";
import { formatEther } from "../../../../utils/money";
import { useStyles } from "./styles";

interface IErc998DropboxItemProps {
  dropbox: IErc998Dropbox;
}

export const DropboxItem: FC<IErc998DropboxItemProps> = props => {
  const { dropbox } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-dropboxes/${dropbox.id}`}>
        <CardMedia className={classes.media} image={dropbox.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {dropbox.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={dropbox.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatEther(dropbox.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container alignItems="center">
          <Erc998DropboxTemplateBuyButton dropbox={dropbox} />
        </Grid>
      </CardActions>
    </Card>
  );
};
