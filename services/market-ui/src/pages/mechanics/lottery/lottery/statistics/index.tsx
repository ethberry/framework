import { FC, useEffect, useState } from "react";

import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { IContract, ILotteryRound } from "@framework/types";

import { emptyLotteryRound } from "../../../../../components/common/interfaces";

interface ILotteryStatisticProps {
  contract: IContract;
}

export const LotteryStatistic: FC<ILotteryStatisticProps> = props => {
  const { contract } = props;

  const [round, setRound] = useState<ILotteryRound | null>(emptyLotteryRound);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/lottery/rounds/latest",
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
    void fetchRound();
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <pre>{JSON.stringify(round, null, "\t")}</pre>
    </ProgressOverlay>
  );
};
