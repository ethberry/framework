import { FC, Fragment, useEffect, useState } from "react";
import { constants } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { CronExpression, IRaffleOption } from "@framework/types";

import { RafflePurchaseButton } from "../../../../components/buttons";

export const RafflePurchase: FC = () => {
  const [_raffle, setRaffle] = useState<IRaffleOption>({
    address: constants.AddressZero,
    description: "Raffle",
    schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
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
          <RafflePurchaseButton />
        </PageHeader>
      </ProgressOverlay>
    </Fragment>
  );
};
