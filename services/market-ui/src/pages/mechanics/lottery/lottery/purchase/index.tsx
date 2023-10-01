import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
// import { RichTextDisplay } from "@gemunion/mui-rte";
import { CronExpression, IContract, ILotteryRound } from "@framework/types";

import { formatPrice } from "../../../../../utils/money";
import { LotteryPurchaseButton } from "../../../../../components/buttons";
import { emptyLotteryRound } from "../../../../../components/common/interfaces";
import { getDefaultNumbers, getSelectedNumbers } from "../../token-list/utils";
import { StyledIconButton, StyledPaper, StyledTypography, StyledWrapper } from "./styled";
import { AllowanceButton } from "./allowance";

const maxNumbers = 6;

interface ILotteryPurchaseProps {
  contract: IContract;
}

export const LotteryPurchase: FC<ILotteryPurchaseProps> = props => {
  const { contract } = props;
  const [ticketNumbers, setTicketNumbers] = useState<Array<boolean>>(getDefaultNumbers());
  const selectedNumbers = getSelectedNumbers(ticketNumbers);

  const [round, setRound] = useState<ILotteryRound>(emptyLotteryRound);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/lottery/rounds/current",
        data: {
          contractId: contract.id,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchRound = async (): Promise<any> => {
    return fn()
      .then((json: ILotteryRound) => {
        setRound(json);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    if (contract.id) {
      void fetchRound();
    }
  }, [contract.id]);

  const handleClick = (i: number) => {
    return () => {
      if (ticketNumbers.filter(Boolean).length >= maxNumbers && !ticketNumbers[i]) {
        return;
      }
      const newNumbers = [...ticketNumbers];
      newNumbers[i] = !newNumbers[i];
      setTicketNumbers(newNumbers);
    };
  };

  const clearForm = () => {
    setTicketNumbers(getDefaultNumbers());
  };

  return (
    <Fragment>
      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message="pages.lottery.purchase.title">
          <StyledTypography>{round ? formatPrice(round.price) : "Round not Active!"}</StyledTypography>

          <StyledTypography>
            {round.maxTickets > 0 ? (
              <FormattedMessage
                id="pages.lottery.purchase.count"
                // @ts-ignore
                values={{ current: round.ticketCount, max: round?.maxTickets }}
              />
            ) : (
              <FormattedMessage
                id="pages.raffle.purchase.sold"
                // @ts-ignore
                values={{ count: round ? round.ticketCount : 0 }}
              />
            )}
          </StyledTypography>

          <AllowanceButton contract={contract} />

          {round ? (
            <LotteryPurchaseButton
              round={round}
              clearForm={clearForm}
              ticketNumbers={ticketNumbers}
              disabled={
                ticketNumbers.filter(Boolean).length < maxNumbers ||
                // @ts-ignore
                (round.maxTickets > 0 && round.maxTickets <= round.ticketCount)
              }
            />
          ) : null}
        </PageHeader>
      </ProgressOverlay>
      <StyledTypography variant="body1">
        {contract.parameters.schedule
          ? Object.keys(CronExpression)[
              Object.values(CronExpression).indexOf(contract.parameters.schedule as unknown as CronExpression)
            ]
          : "not yet scheduled"}
      </StyledTypography>
      <StyledPaper>
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
        <FormattedMessage
          id="pages.lottery.purchase.rules"
          values={{
            commission: 100 - ~~contract.parameters.commission,
          }}
        />
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
              disabled={!isSelected && selectedNumbers.length === maxNumbers}
            >
              {i + 1}
            </StyledIconButton>
          );
        })}
      </StyledPaper>
    </Fragment>
  );
};
