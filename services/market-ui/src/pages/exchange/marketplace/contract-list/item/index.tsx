import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

import { StyledCardMedia } from "./styled";

interface IContractListItemProps {
  contract: IContract;
}

export const ContractListItem: FC<IContractListItemProps> = props => {
  const { contract } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/marketplace/contracts/${contract.id}`}>
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
