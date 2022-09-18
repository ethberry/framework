import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { LotteryPurchaseButton } from "../../../../components/buttons";
import { StyledIconButton, StyledPaper, StyledTypography, StyledWrapper } from "./styled";

const maxTickets = 6;

export const LotteryPurchase: FC = () => {
  const [ticketNumbers, setTicketNumbers] = useState<Array<boolean>>(new Array(36).fill(false));

  const selectedNumbers = ticketNumbers.reduceRight((acc: number[], cell: boolean, i: number) => {
    cell && acc.push(i + 1);
    return acc;
  }, []);

  const handleClick = (i: number) => {
    return () => {
      if (ticketNumbers.filter(e => e).length >= maxTickets && !ticketNumbers[i]) {
        return;
      }
      const newNumbers = [...ticketNumbers];
      newNumbers[i] = !newNumbers[i];
      setTicketNumbers(newNumbers);
    };
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.purchase"]} />

      <PageHeader message="pages.lottery.purchase.title">
        <LotteryPurchaseButton ticketNumbers={ticketNumbers} />
      </PageHeader>

      <StyledPaper sx={{ maxWidth: "36em", flexDirection: "column" }}>
        <StyledTypography variant="h6">
          <FormattedMessage
            id="pages.lottery.purchase.selected"
            values={{ selected: ticketNumbers.filter(e => e).length }}
          />
        </StyledTypography>

        <StyledWrapper>
          {new Array(6)
            .fill(null)
            .slice(selectedNumbers.length)
            .concat(selectedNumbers)
            .reverse()
            .map((e: number | null, i: number) => {
              return (
                <StyledIconButton
                  size="medium"
                  key={i}
                  color="default"
                  isSelected={!!e}
                  onClick={e ? handleClick(e - 1) : undefined}
                  disabled={!e}
                >
                  {e || null}
                </StyledIconButton>
              );
            })}
        </StyledWrapper>
      </StyledPaper>

      <StyledTypography variant="h6">
        <FormattedMessage id="pages.lottery.purchase.rules" />
      </StyledTypography>

      <StyledPaper>
        {new Array(36).fill(null).map((e, i) => {
          const isSelected = ticketNumbers[i];

          return (
            <StyledIconButton
              size="medium"
              key={i}
              color="default"
              isSelected={isSelected}
              onClick={handleClick(i)}
              disabled={!isSelected && selectedNumbers.length === maxTickets}
            >
              {i + 1}
            </StyledIconButton>
          );
        })}
      </StyledPaper>
    </Fragment>
  );
};
