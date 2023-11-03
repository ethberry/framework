import { FC, useState } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { IAsset, ILotteryRound } from "@framework/types";

import { formatItem } from "../../../../../../utils/money";
import { deepClone } from "../../../../../../utils/lodash";
import {
  ExpandMore,
  Root,
  StyledButton,
  StyledCollapse,
  StyledMatch,
  StyledMatches,
  StyledMatchPrize,
  StyledMatchSubtitle,
  StyledMatchTitle,
  StyledMatchWinners,
  StyledTotalInfo,
  StyledTotalTitle,
} from "./styled";

export interface IDetailsProps {
  round: ILotteryRound;
  commission?: string | number;
}

export const Details: FC<IDetailsProps> = props => {
  const { round, commission = 0 } = props;

  const { formatMessage } = useIntl();

  const openText = formatMessage({ id: "pages.lottery.contract.statistics.collapse.open" });
  const closeText = formatMessage({ id: "pages.lottery.contract.statistics.collapse.close" });
  const { aggregation, price } = round;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const totalTickets = aggregation?.reduce((total, aggregation) => total + aggregation.tickets, 0) || 0;

  const getTotalPrice = (price: IAsset | undefined, tickets: number) => {
    if (!price) {
      return price;
    }
    const clonedPrice = deepClone<IAsset>(price);
    clonedPrice.components.forEach(component => {
      const amount = (BigInt(component.amount) * BigInt(tickets)).toString();
      component.amount = ((BigInt(amount) * BigInt(100 - ~~commission)) / 100n).toString();
    });
    return clonedPrice;
  };

  return (
    <Root>
      <StyledCollapse in={expanded} timeout={600} unmountOnExit>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <StyledTotalInfo>
              <StyledTotalTitle>
                <FormattedMessage id="pages.lottery.contract.statistics.prizePot" />: <br />
                {formatItem(getTotalPrice(price, totalTickets))}
              </StyledTotalTitle>
              <StyledTotalTitle>
                <FormattedMessage id="pages.lottery.contract.statistics.totalTickets" />: {totalTickets}
              </StyledTotalTitle>
            </StyledTotalInfo>
          </Grid>
          <Grid item xs={12} sm={9}>
            <StyledMatchTitle>
              <FormattedMessage id="pages.lottery.contract.statistics.matches.title" />
            </StyledMatchTitle>
            <StyledMatches>
              <Grid container spacing={2}>
                {aggregation
                  ?.filter(a => a.match !== 0)
                  .map(aggregation => (
                    <Grid item xs={12} sm={4} key={aggregation.priceId}>
                      <StyledMatch>
                        <StyledMatchSubtitle>
                          <FormattedMessage
                            id="pages.lottery.contract.statistics.matches.match.title"
                            values={{ amount: aggregation.match }}
                          />
                        </StyledMatchSubtitle>
                        <StyledMatchPrize>{formatItem(aggregation.price)}</StyledMatchPrize>
                        <StyledMatchWinners>
                          <FormattedMessage
                            id="pages.lottery.contract.statistics.matches.match.win"
                            values={{ amount: aggregation.tickets }}
                          />
                        </StyledMatchWinners>
                      </StyledMatch>
                    </Grid>
                  ))}
              </Grid>
            </StyledMatches>
          </Grid>
        </Grid>
      </StyledCollapse>
      <StyledButton
        aria-expanded={expanded}
        aria-label="show more"
        endIcon={<ExpandMore expanded={expanded} />}
        onClick={handleExpandClick}
      >
        {expanded ? closeText : openText}
      </StyledButton>
    </Root>
  );
};
