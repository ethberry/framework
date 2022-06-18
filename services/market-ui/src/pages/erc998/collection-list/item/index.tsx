import { FC } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IErc998Collection } from "@framework/types";

import { useStyles } from "./styles";

interface IErc998TokenItemProps {
  collection: IErc998Collection;
}

export const CollectionItem: FC<IErc998TokenItemProps> = props => {
  const { collection } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-collections/${collection.id}`}>
        <CardMedia className={classes.media} image={collection.imageUrl} title={`${collection.title}`} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {collection.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
