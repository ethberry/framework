import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract, IRaffleRound } from "@framework/types";

import { formatPrice } from "../../../../../utils/money";
import { RafflePurchaseButton } from "../../../../../components/buttons";
import { emptyRaffleRound } from "../../../../../components/common/interfaces";
import { StyledTypography } from "./styled";
import { AllowanceButton } from "./allowance";

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
          <StyledTypography>{round ? formatPrice(round.price) : "Round not Active!"}</StyledTypography>

          <StyledTypography>
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
          </StyledTypography>

          <AllowanceButton contract={contract} />

          {round ? (
            <RafflePurchaseButton
              round={round}
              // @ts-ignore
              disabled={round.maxTickets > 0 && round.maxTickets <= round.ticketCount}
            />
          ) : null}
        </PageHeader>
      </ProgressOverlay>
    </Fragment>
  );
};
