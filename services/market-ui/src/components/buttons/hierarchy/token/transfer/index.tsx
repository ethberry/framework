import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import ERC721SafeTransferFromABI from "../../../../../abis/hierarchy/erc721/transfer/safeTransferFrom.abi.json";

import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface IErc721TransferButtonProps {
  token: IToken;
}

export const Erc721TransferButton: FC<IErc721TransferButtonProps> = props => {
  const { token } = props;

  const [isTransferTokenDialogOpen, setIsTransferTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((dto: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      token.template!.contract!.address,
      ERC721SafeTransferFromABI,
      web3Context.provider?.getSigner(),
    );
    return contract["safeTransferFrom(address,address,uint256)"](
      web3Context.account,
      dto.account,
      token.tokenId,
    ) as Promise<any>;
  });

  const handleTransfer = (): void => {
    setIsTransferTokenDialogOpen(true);
  };

  const handleTransferConfirm = async (dto: IAccountDto) => {
    await metaFn(dto).finally(() => {
      setIsTransferTokenDialogOpen(false);
    });
  };

  const handleTransferCancel = () => {
    setIsTransferTokenDialogOpen(false);
  };

  return (
    <Fragment>
      <Tooltip title={formatMessage({ id: "form.tips.transfer" })}>
        <Button
          onClick={handleTransfer}
          disabled={token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
          data-testid="Erc721TransferButton"
        >
          <FormattedMessage id="form.buttons.transfer" />
        </Button>
      </Tooltip>
      <AccountDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="Erc721TransferDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
