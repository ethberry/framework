import { FC, Fragment, useState } from "react";
import { DoNotDisturbOff } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { NodeEnv, TokenType } from "@framework/types";

import { getListenerType } from "../../../../utils/listener-type";
import { EthListenerRemoveDialog, IEthListenerRemoveDto } from "./dialog";

export interface IEthListenerRemoveButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const EthListenerRemoveButton: FC<IEthListenerRemoveButtonProps> = props => {
  const { className, contract, disabled, variant } = props;

  const [isEthListenerDialogOpen, setIsEthListenerDialogOpen] = useState(false);

  const handleEthListenerRemove = (): void => {
    setIsEthListenerDialogOpen(true);
  };

  const handleEthListenerRemoveCancel = (): void => {
    setIsEthListenerDialogOpen(false);
  };

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/eth-logger/remove",
      method: "POST",
      data: values,
    });
  });

  const handleEthListenerRemoveConfirm = async (values: IEthListenerRemoveDto): Promise<void> => {
    await fn(void 0, values).finally(() => {
      setIsEthListenerDialogOpen(false);
    });
  };

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  if (contract.contractType === TokenType.NATIVE) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleEthListenerRemove}
        icon={DoNotDisturbOff}
        message="form.buttons.removeListener"
        className={className}
        dataTestId="EthListenerRemoveButton"
        disabled={disabled}
        variant={variant}
      />
      <EthListenerRemoveDialog
        onCancel={handleEthListenerRemoveCancel}
        onConfirm={handleEthListenerRemoveConfirm}
        open={isEthListenerDialogOpen}
        initialValues={{
          address: contract.address,
          listenerType: getListenerType(contract),
          chainId: contract.chainId,
        }}
      />
    </Fragment>
  );
};
