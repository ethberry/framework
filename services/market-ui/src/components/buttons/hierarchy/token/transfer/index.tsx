import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Button, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IToken } from "@framework/types";

import ERC721Sol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface ITokenTransferButtonProps {
  token: IToken;
}

export const TokenTransferButton: FC<ITokenTransferButtonProps> = props => {
  const { token } = props;

  const [isTransferTokenDialogOpen, setIsTransferTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  //  TODO different types of token contracts abi!
  const metaFn = useMetamask((dto: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(token.template!.contract!.address, ERC721Sol.abi, web3Context.provider?.getSigner());
    return contract["safeTransferFrom(address,address,uint256,bytes)"](
      web3Context.account,
      dto.account,
      token.tokenId,
      utils.hexZeroPad(BigNumber.from(token.tokenId).toHexString(), 32),
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
        <Button onClick={handleTransfer} data-testid="TokenTransferButton">
          <FormattedMessage id="form.buttons.transfer" />
        </Button>
      </Tooltip>
      <AccountDialog
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        open={isTransferTokenDialogOpen}
        message="dialogs.transfer"
        testId="TransferTokenDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
