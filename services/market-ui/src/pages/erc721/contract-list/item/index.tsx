import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";

interface IErc721ContractItemProps {
  contract: IContract;
}

export const ContractItem: FC<IErc721ContractItemProps> = props => {
  const { contract } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721-contracts/${contract.id}`}>
        <CardHeader title={contract.title} />
        <CardMedia className={classes.media} image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={contract.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
