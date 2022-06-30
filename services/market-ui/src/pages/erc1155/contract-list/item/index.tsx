import { FC } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IUniContract } from "@framework/types";

import { useStyles } from "./styles";

interface IErc1155TokenItemProps {
  contract: IUniContract;
}

export const Erc1155CollectionItem: FC<IErc1155TokenItemProps> = props => {
  const { contract } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc1155-contracts/${contract.id}`}>
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
