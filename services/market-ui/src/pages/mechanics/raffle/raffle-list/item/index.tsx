import { FC } from "react";
import { CardActionArea, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { StyledCard } from "./styled";

interface IRaffleListItemProps {
  contract: IContract;
}

export const RaffleListItem: FC<IRaffleListItemProps> = props => {
  const { contract } = props;

  return (
    <StyledCard>
      <CardActionArea component={RouterLink} to={`/raffle/contracts/${contract.id}`}>
        <CardHeader title={contract.title} />
        <CardMedia sx={{ height: 140 }} image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={contract.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};
