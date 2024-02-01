import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardMedia } from "@framework/styled";
import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

interface IErc721ContractListItemProps {
  contract: IContract;
}

export const Erc721ContractListItem: FC<IErc721ContractListItemProps> = props => {
  const { contract } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc721/contracts/${contract.id}`}>
        <CardHeader title={contract.title} />
        <StyledCardMedia image={contract.imageUrl} title={`${contract.title}`} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={contract.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
