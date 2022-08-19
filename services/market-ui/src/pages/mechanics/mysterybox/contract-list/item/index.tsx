import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { useStyles } from "./styles";

interface IMysteryboxContractListItemProps {
  contract: IContract;
}

export const MysteryboxContractListItem: FC<IMysteryboxContractListItemProps> = props => {
  const { contract } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/mysterybox-contracts/${contract.id}`}>
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
