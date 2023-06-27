import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { constants } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CronExpression, IRaffleOption } from "@framework/types";

import { RafflePurchaseButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { StyledPaper, StyledTypography } from "./styled";

export const RafflePurchase: FC = () => {
  const [raffle, setRaffle] = useState<IRaffleOption>({
    address: constants.AddressZero,
    description: "Raffle",
    schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
    round: {},
  });

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/raffle/rounds/options",
      });
    },
    { success: false, error: false },
  );

  const fetchRaffle = async (): Promise<any> => {
    return fn()
      .then((json: IRaffleOption) => {
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
            {raffle.round ? <RafflePurchaseButton round={raffle.round} /> : null}
            {raffle.round ? formatPrice(raffle.round.price) : "Round not Active!"}
          </StyledPaper>
        </PageHeader>
      </ProgressOverlay>
      <StyledTypography variant="h6">{raffle.description}</StyledTypography>
      <StyledTypography variant="body1">
        {Object.keys(CronExpression)[Object.values(CronExpression).indexOf(raffle.schedule)]}
      </StyledTypography>
      <StyledTypography variant="h6">
        <FormattedMessage id="pages.raffle.purchase.rules" />
      </StyledTypography>
    </Fragment>
  );
};
