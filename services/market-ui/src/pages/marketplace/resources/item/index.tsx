import { FC } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useIntl } from "react-intl";

import { IErc1155Token } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { NumberInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";
import { formatMoney } from "../../../../utils/money";

interface IErc1155TokenItemProps {
  token: IErc1155Token;
}

export const TokenItem: FC<IErc1155TokenItemProps> = props => {
  const { token } = props;

  const { formatMessage } = useIntl();
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/erc1155-tokens/${token.id}`}>
        <CardMedia className={classes.media} image={token.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {token.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={token.description} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {formatMoney(token.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <NumberInput
          name={token.tokenId}
          placeholder={formatMessage({ id: "form.placeholders.amount" })}
          label={formatMessage({ id: "form.labels.amount" })}
          InputProps={{ inputProps: { min: 0, step: 100 } }}
        />
      </CardActions>
    </Card>
  );
};
