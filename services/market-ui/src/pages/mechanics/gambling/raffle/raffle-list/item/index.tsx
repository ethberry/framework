import { FC } from "react";
import { CardActionArea, CardContent, CardHeader } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@ethberry/mui-rte";

import { StyledCard } from "./styled";

interface IRaffleListItemProps {
  contract: IContract;
}

export const RaffleListItem: FC<IRaffleListItemProps> = props => {
  const { contract } = props;

  return (
    <StyledCard>
      <CardActionArea component={RouterLink} to={`/raffle/contracts/${contract.id}/view`}>
        <CardHeader title={contract.title} />
        <StyledCardMedia image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={contract.description} />
          </StyledCardContentDescription>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};
