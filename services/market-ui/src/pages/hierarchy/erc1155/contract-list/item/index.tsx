import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { StyledCardMedia } from "@framework/styled";
import type { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";

interface IErc1155TokenItemProps {
  contract: IContract;
}

export const Erc1155ContractListItem: FC<IErc1155TokenItemProps> = props => {
  const { contract } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc1155/contracts/${contract.id}`}>
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
