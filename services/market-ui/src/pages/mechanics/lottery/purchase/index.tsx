import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { constants } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";

import { CronExpression, IContract } from "@framework/types";

import { LotteryPurchaseButton } from "../../../../components/buttons";
import { getDefaultNumbers, getSelectedNumbers } from "../token-list/utils";

import { StyledIconButton, StyledPaper, StyledTypography, StyledWrapper } from "./styled";
import { formatPrice } from "../../../../utils/money";

const maxNumbers = 6;

interface ILotteryPurchaseProps {
  contract: IContract;
}

export const LotteryPurchase: FC<ILotteryPurchaseProps> = props => {
  const { contract } = props;
  const [ticketNumbers, setTicketNumbers] = useState<Array<boolean>>(getDefaultNumbers());
  const selectedNumbers = getSelectedNumbers(ticketNumbers);

  const [lottery, setLottery] = useState<any>({
    address: constants.AddressZero,
    parameters: {
      schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
    },
    round: {},
  });

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/lottery/rounds/options",
        data: {
          contractId: contract.id,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchLottery = async (): Promise<any> => {
    return fn()
      .then((json: IContract) => {
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
      if (ticketNumbers.filter(e => e).length >= maxNumbers && !ticketNumbers[i]) {
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
      <Breadcrumbs path={["dashboard", "lottery", "lottery.purchase"]} />
      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message="pages.lottery.purchase.title">
          <StyledPaper sx={{ maxWidth: "12em", flexDirection: "column" }}>
            {lottery.round ? (
              <LotteryPurchaseButton round={lottery.round} clearForm={clearForm} ticketNumbers={ticketNumbers} />
            ) : null}
            {lottery.round ? formatPrice(lottery.round.price) : "Round not Active!"}
          </StyledPaper>
        </PageHeader>
      </ProgressOverlay>
      <StyledTypography variant="body1">
        {
          Object.keys(CronExpression)[
            Object.values(CronExpression).indexOf(lottery.schedule as unknown as CronExpression)
          ]
        }
      </StyledTypography>
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
