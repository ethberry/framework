import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { formatItem } from "@framework/exchange";
import { IContract, IRaffleRound } from "@framework/types";

import { RafflePurchaseButton } from "../../../../../../components/buttons";
import { emptyRaffleRound } from "../../../../../../components/common/interfaces";
import { InfoPopover } from "../../../../../../components/popover";
import { AllowanceButton } from "./allowance";
import { StyledTypography } from "./styled";

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

  const title = round?.roundId ? "pages.raffle.purchase.titleRound" : "pages.raffle.purchase.title";

  return (
    <Fragment>
      <ProgressOverlay isLoading={isLoading}>
        <PageHeader message={title} data={{ roundId: round?.roundId }}>
          <InfoPopover>
            <StyledTypography>
              <FormattedMessage
                id={round?.roundId ? "pages.lottery.purchase.price" : "pages.lottery.purchase.notStarted"}
                values={{ price: formatItem(round?.price) }}
              />
            </StyledTypography>

            <StyledTypography>
              {round?.maxTickets > 0 ? (
                <FormattedMessage
                  id="pages.raffle.purchase.count"
                  values={{ current: round?.ticketCount, max: round?.maxTickets }}
                />
              ) : (
                <FormattedMessage id="pages.raffle.purchase.sold" values={{ count: round?.ticketCount || 0 }} />
              )}
            </StyledTypography>
          </InfoPopover>

          <AllowanceButton contract={contract} />

          <RafflePurchaseButton round={round} />
        </PageHeader>
      </ProgressOverlay>
    </Fragment>
  );
};
