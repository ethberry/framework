import { FC, useState } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { formatItem } from "@framework/exchange";
import { IAsset, ILotteryRound, ILotteryRoundAggregation } from "@framework/types";

import { deepClone } from "../../../../../../../utils/lodash";
import { getPrizeAsset } from "../../../../../../../utils/lottery";
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
  const { aggregation = [], price } = round;

  // add Zero aggregations
  const partialAggregation: Array<Partial<ILotteryRoundAggregation>> = [];
  const count = 6;
  for (let i = 0; i < count + 1; i++) {
    const match = aggregation?.filter(aggr => aggr.match === i);
    if (match.length === 0) {
      partialAggregation.push({ match: i, tickets: 0 });
    } else {
      partialAggregation.push(match[0]);
    }
  }
  const aggregationNumbers = partialAggregation.map(aggr => (aggr.tickets ? aggr.tickets : 0));

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
                <FormattedMessage id="pages.lottery.contract.statistics.totalTickets" />: {totalTickets}
              </StyledTotalTitle>
              <StyledTotalTitle>
                <FormattedMessage id="pages.lottery.contract.statistics.prizePot" />: <br />
                {formatItem(getTotalPrice(price, totalTickets))}
              </StyledTotalTitle>
            </StyledTotalInfo>
          </Grid>
          <Grid item xs={12} sm={9}>
            <StyledMatchTitle>
              <FormattedMessage id="pages.lottery.contract.statistics.matches.title" />
            </StyledMatchTitle>
            <StyledMatches>
              <Grid container spacing={2}>
                {partialAggregation.reverse().map(aggregation => (
                  <Grid item xs={12} sm={4} key={aggregation.match}>
                    <StyledMatch>
                      <StyledMatchSubtitle>
                        <FormattedMessage
                          id="pages.lottery.contract.statistics.matches.match.title"
                          values={{ amount: aggregation.match }}
                        />
                      </StyledMatchSubtitle>
                      {/* {aggregation.price ? <StyledMatchPrize>{formatItem(aggregation.price)}</StyledMatchPrize> : null} */}
                      {aggregation.price ? (
                        <StyledMatchPrize>
                          {formatItem(
                            getPrizeAsset(
                              getTotalPrice(price, totalTickets),
                              aggregation.match ? aggregation.match : 0,
                              aggregationNumbers,
                            ),
                            5,
                          )}
                        </StyledMatchPrize>
                      ) : null}
                      <StyledMatchWinners>
                        {aggregation.match === 0 ? (
                          <FormattedMessage
                            id="pages.lottery.contract.statistics.matches.match.loose"
                            values={
                              aggregation.tickets && aggregation.tickets > 1
                                ? { amount: aggregation.tickets, many: "s" }
                                : { amount: aggregation.tickets, many: "" }
                            }
                          />
                        ) : (
                          <FormattedMessage
                            id="pages.lottery.contract.statistics.matches.match.win"
                            values={
                              aggregation.tickets && aggregation.tickets > 1
                                ? { amount: aggregation.tickets, many: "s" }
                                : { amount: aggregation.tickets, many: "" }
                            }
                          />
                        )}
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
