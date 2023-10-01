import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

interface IMysteryContractListItemProps {
  contract: IContract;
}

export const MysteryContractListItem: FC<IMysteryContractListItemProps> = props => {
  const { contract } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/mystery/contracts/${contract.id}`}>
        <CardHeader title={contract.title} />
        <StyledCardMedia height={140} image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={contract.description} />
          </StyledCardContentDescription>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
