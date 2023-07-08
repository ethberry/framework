import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CronExpression, IContract, IRaffleContractRound } from "@framework/types";

import { RafflePurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { StyledPaper, StyledTypography } from "./styled";
import { emptyRaffle } from "../../../../components/common/interfaces";

interface IRafflePurchaseProps {
  contract: IContract;
}

export const RafflePurchase: FC<IRafflePurchaseProps> = props => {
  const { contract } = props;

  const [raffle, setRaffle] = useState<IRaffleContractRound>(emptyRaffle);

  const { fn, isLoading } = useApiCall(
    async api => {
      return contract.id
        ? api.fetchJson({
            url: "/raffle/rounds/options",
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
      .then((json: IRaffleContractRound) => {
        setRaffle(json);
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
      <Breadcrumbs path={["dashboard", "raffle", "raffle.purchase"]} />

      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message="pages.raffle.purchase.title">
          <StyledPaper sx={{ maxWidth: "12em", flexDirection: "column" }}>
            {raffle.round ? (
              <RafflePurchaseButton
                round={raffle.round}
                disabled={raffle.round.maxTickets > 0 && raffle.round.maxTickets <= raffle.count}
              />
            ) : null}
            {raffle.round ? formatPrice(raffle.round.price) : "Round not Active!"}
          </StyledPaper>
          <StyledPaper sx={{ maxWidth: "6em", flexDirection: "row" }}>
            {raffle.round && raffle.round.maxTickets > 0 ? (
              <FormattedMessage
                id="pages.raffle.purchase.count"
                values={{ current: raffle.count, max: raffle.round?.maxTickets }}
              />
            ) : (
              <FormattedMessage id="pages.raffle.purchase.sold" values={{ count: raffle.count }} />
            )}
          </StyledPaper>
        </PageHeader>
      </ProgressOverlay>
      <StyledTypography variant="body1">
        {raffle.parameters.schedule
          ? Object.keys(CronExpression)[
              Object.values(CronExpression).indexOf(raffle.parameters.schedule as unknown as CronExpression)
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
