import { FC, Fragment, useState } from "react";
import { DoNotDisturbOn } from "@mui/icons-material";

import { NodeEnv } from "@gemunion/constants";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import { getListenerType } from "../../../../utils/listener-type";
import { shouldDisableByContractType } from "../../utils";
import { EthListenerAddDialog, IEthListenerAddDto } from "./dialog";

export interface IEthListenerAddButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const EthListenerAddButton: FC<IEthListenerAddButtonProps> = props => {
  const {
    className,
    contract,
    contract: { contractType },
    disabled,
    variant,
  } = props;

  const [isEthListenerDialogOpen, setIsEthListenerDialogOpen] = useState(false);

  const handleEthListenerAdd = (): void => {
    setIsEthListenerDialogOpen(true);
  };

  const handleEthListenerAddCancel = (): void => {
    setIsEthListenerDialogOpen(false);
  };

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/eth-logger/add",
      method: "POST",
      data: values,
    });
  });

  const handleEthListenerAddConfirm = async (values: IEthListenerAddDto): Promise<void> => {
    await fn(void 0, values).finally(() => {
      setIsEthListenerDialogOpen(false);
    });
  };

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  if (contractType === TokenType.NATIVE) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleEthListenerAdd}
        icon={DoNotDisturbOn}
        message="form.buttons.addListener"
        className={className}
        dataTestId="EthListenerAddButton"
        disabled={disabled || shouldDisableByContractType(contract)}
        variant={variant}
      />
      <EthListenerAddDialog
        onCancel={handleEthListenerAddCancel}
        onConfirm={handleEthListenerAddConfirm}
        open={isEthListenerDialogOpen}
        initialValues={{
          address: contract.address,
          listenerType: getListenerType(contract),
          fromBlock: contract.fromBlock,
          chainId: contract.chainId,
        }}
      />
    </Fragment>
  );
};
