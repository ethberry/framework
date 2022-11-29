import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useApiCall } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";

import { ILotteryOption, CronExpression } from "@framework/types";

import { LotteryPurchaseButton } from "../../../../components/buttons";
import { getDefaultTickets, getSelectedNumbers } from "../ticket-list/utils";

import { StyledIconButton, StyledPaper, StyledTypography, StyledWrapper } from "./styled";

const maxTickets = 6;

export const LotteryPurchase: FC = () => {
  const [ticketNumbers, setTicketNumbers] = useState<Array<boolean>>(getDefaultTickets());
  const selectedNumbers = getSelectedNumbers(ticketNumbers);

  const [lottery, setLottery] = useState<ILotteryOption>({
    description: "Lottery",
    schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
  });

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/lottery/rounds/options",
      });
    },
    { success: false, error: false },
  );

  const fetchLottery = async (): Promise<any> => {
    return fn()
      .then((json: ILotteryOption) => {
        setLottery(json);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchLottery();
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

  const clearForm = () => {
    setTicketNumbers(getDefaultTickets());
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.purchase"]} />
      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message="pages.lottery.purchase.title">
          <LotteryPurchaseButton clearForm={clearForm} ticketNumbers={ticketNumbers} />
        </PageHeader>
      </ProgressOverlay>
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

      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <StyledTypography variant="h6">{lottery.description}</StyledTypography>
      <StyledTypography variant="body1">
        {
          Object.keys(CronExpression)[
            Object.values(CronExpression).indexOf(lottery.schedule as unknown as CronExpression)
          ]
        }
      </StyledTypography>
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
