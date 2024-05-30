import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { formatItem } from "@framework/exchange";
import type { IContract, ILotteryRound } from "@framework/types";

import { LotteryPurchaseButton } from "../../../../../../components/buttons";
import { emptyLotteryRound } from "../../../../../../components/common/interfaces";
import { InfoPopover } from "../../../../../../components/popover";
import { getDefaultNumbers, getSelectedNumbers } from "../../token-list/utils";
import { AllowanceButton } from "./allowance";
import { StyledIconButton, StyledPaper, StyledTypography, StyledWrapper } from "./styled";

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
      .then((json: ILotteryRound | null) => {
        if (json) {
          setRound(json);
        }
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

  const title = round.roundId ? "pages.lottery.purchase.titleRound" : "pages.lottery.purchase.title";

  return (
    <Fragment>
      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message={title} data={{ roundId: round.roundId }}>
          <InfoPopover>
            <StyledTypography>
              <FormattedMessage
                id={round.roundId ? "pages.lottery.purchase.price" : "pages.lottery.purchase.notStarted"}
                values={{ price: formatItem(round.price) }}
              />
            </StyledTypography>

            <StyledTypography>
              {round.maxTickets > 0 ? (
                <FormattedMessage
                  id="pages.lottery.purchase.count"
                  // @ts-ignore
                  values={{ current: round.ticketCount, max: round?.maxTickets }}
                />
              ) : round.roundId ? (
                <FormattedMessage
                  id="pages.raffle.purchase.sold"
                  // @ts-ignore
                  values={{ count: round ? round.ticketCount : 0 }}
                />
              ) : null}
            </StyledTypography>
          </InfoPopover>

          <AllowanceButton contract={contract} />

          <LotteryPurchaseButton
            round={round}
            clearForm={clearForm}
            ticketNumbers={ticketNumbers}
            disabled={ticketNumbers.filter(Boolean).length < maxNumbers}
          />
        </PageHeader>
      </ProgressOverlay>

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
        <StyledWrapper>
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
        </StyledWrapper>
      </StyledPaper>
    </Fragment>
  );
};
