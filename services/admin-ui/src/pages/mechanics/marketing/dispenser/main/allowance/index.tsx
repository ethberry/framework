import { FC, useEffect, useState } from "react";
import { constants } from "ethers";

import { useApiCall } from "@ethberry/react-hooks";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";
import { ListActionVariant } from "@framework/styled";

import { AllowanceButton } from "../../../../../../components/buttons";

export const AllowanceButtonForDispenser: FC = props => {
  const [contract, setContract] = useState<IContract>({
    address: constants.AddressZero,
    contractFeatures: [],
  } as unknown as IContract);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/contracts/system",
        method: "POST",
        data: {
          contractModule: SystemModuleType.DISPENSER,
        },
      });
    },
    { success: false },
  );

  useEffect(() => {
    void fn().then(setContract);
  }, []);

  return <AllowanceButton {...props} contract={contract} disabled={!isLoading} variant={ListActionVariant.button} />;
};
