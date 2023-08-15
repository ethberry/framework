import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CronExpression, IContract, IRaffleRound } from "@framework/types";

import { formatPrice } from "../../../../../utils/money";
import { RafflePurchaseButton } from "../../../../../components/buttons";
import { emptyRaffleRound } from "../../../../../components/common/interfaces";
import { StyledPaper, StyledTypography } from "./styled";

interface IRafflePurchaseProps {
  contract: IContract;
}

export const RafflePurchase: FC<IRafflePurchaseProps> = props => {
  const { contract } = props;

  const [round, setRound] = useState<IRaffleRound>(emptyRaffleRound);

  const { fn, isLoading } = useApiCall(
    async api => {
      return contract.id
        ? api.fetchJson({
            url: "/raffle/rounds/current",
            data: {
              contractId: contract.id,
            },
          })
        : null;
    },
    { success: false, error: false },
  );

  const fetchRaffle = async (): Promise<any> => {
    return fn()
      .then((json: IRaffleRound) => {
        setRound(json);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchRaffle();
  }, []);

  return (
    <Fragment>
      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message="pages.raffle.purchase.title">
          <StyledPaper sx={{ maxWidth: "12em", flexDirection: "column" }}>
            {round ? (
              <RafflePurchaseButton
                round={round}
                // @ts-ignore
                disabled={round.maxTickets > 0 && round.maxTickets <= round.ticketCount}
              />
            ) : null}
            {round && round ? formatPrice(round.price) : "Round not Active!"}
          </StyledPaper>
          <StyledPaper sx={{ maxWidth: "6em", flexDirection: "row" }}>
            {round && round && round.maxTickets > 0 ? (
              <FormattedMessage
                id="pages.raffle.purchase.count"
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
          </StyledPaper>
        </PageHeader>
      </ProgressOverlay>
      <StyledTypography variant="body1">
        {contract.parameters.schedule
          ? Object.keys(CronExpression)[
              Object.values(CronExpression).indexOf(contract.parameters.schedule as unknown as CronExpression)
            ]
          : "not yet scheduled"}
      </StyledTypography>
      <StyledTypography variant="h6">
        <FormattedMessage id="pages.raffle.purchase.rules" />
      </StyledTypography>
      <StyledTypography variant="h5">
        <FormattedMessage
          id="pages.raffle.purchase.commission"
          values={{
            commission: Number(contract.parameters.commission) || 0,
          }}
        />
      </StyledTypography>
    </Fragment>
  );
};
