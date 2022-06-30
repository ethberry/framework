import { FC } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IContract } from "@framework/types";

import { useStyles } from "./styles";

interface ITokenItemProps {
  contract: IContract;
}

export const CollectionItem: FC<ITokenItemProps> = props => {
  const { contract } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc998-contract/${contract.id}`}>
        <CardMedia className={classes.media} image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {contract.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
