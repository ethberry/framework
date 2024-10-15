import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardContentDescription, StyledCardMedia } from "@framework/styled";
import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@ethberry/mui-rte";

interface ILootContractListItemProps {
  contract: IContract;
}

export const LootContractListItem: FC<ILootContractListItemProps> = props => {
  const { contract } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/loot/contracts/${contract.id}/view`}>
        <CardHeader title={contract.title} />
        <StyledCardMedia image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <StyledCardContentDescription>
            <RichTextDisplay data={contract.description} />
          </StyledCardContentDescription>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
