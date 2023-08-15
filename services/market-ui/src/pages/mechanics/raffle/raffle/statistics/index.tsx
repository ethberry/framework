import { FC, useEffect, useState } from "react";

import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract, IRaffleRound } from "@framework/types";

import { emptyRaffleRound } from "../../../../../components/common/interfaces";

interface IRaffleStatisticProps {
  contract: IContract;
}

export const RaffleStatistic: FC<IRaffleStatisticProps> = props => {
  const { contract } = props;

  const [round, setRound] = useState<IRaffleRound | null>(emptyRaffleRound);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/raffle/rounds/latest",
        data: {
          contractId: contract.id,
        },
      });
    },
    { success: false, error: false },
  );

  const fetchRound = async (): Promise<any> => {
    return fn()
      .then((json: IRaffleRound) => {
        setRound(json);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    void fetchRound();
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <pre>{JSON.stringify(round, null, "\t")}</pre>
    </ProgressOverlay>
  );
};
