import { FC } from "react";
import { Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { IMerchant } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { StyledCardMedia } from "./styled";

interface IMerchantListItemProps {
  merchant: IMerchant;
}

export const MerchantListItem: FC<IMerchantListItemProps> = props => {
  const { merchant } = props;

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/marketplace/merchants/${merchant.id}`}>
        <CardHeader title={merchant.title} />
        <StyledCardMedia image={merchant.imageUrl} title={`${merchant.title}`} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={merchant.description} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
