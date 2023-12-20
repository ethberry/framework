import { ChangeEvent, FC, Fragment, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { StaticInput } from "@gemunion/mui-inputs-core";
import { FormWrapper } from "@gemunion/mui-form";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IBalance, IToken, TokenType } from "@framework/types";

import safeTransferChildABI from "@framework/abis/safeTransferChild/ERC998Blacklist.json";
import safeTransferFrom1155ABI from "@framework/abis/safeTransferFrom/ERC1155Blacklist.json";
import safeTransferFrom721ABI from "@framework/abis/safeTransferFrom/ERC721Blacklist.json";
import safeTransferFromERC1155ABI from "@framework/abis/safeTransferFromERC1155/ERC998ERC1155ERC20Enum.json";
import transferERC20ABI from "@framework/abis/transferERC20/ERC998ERC1155ERC20Enum.json";
import getERC20ABI from "@framework/abis/getERC20/ERC998ERC1155ERC20Enum.json";

import { formatTokenTitle } from "../../../../../utils/token";
import { ComposeTokenDialog, IComposeTokenDto } from "./dialog";
import { StyledInputAdornment, StyledTitle } from "./styled";

export interface IComposition {
  token: IToken;
  metaFn: (...args: Array<any>) => Promise<any>;
}

export interface IErc998Composition {
  token: IToken;
}

export const Erc998Composition: FC<IErc998Composition> = props => {
  const { token } = props;

  const [action, setAction] = useState<IComposition>({} as IComposition);
  const [isComposeTokenDialogOpen, setIsComposeTokenDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  // combine all function's abi
  const ERC998ABI = safeTransferFromERC1155ABI
    .concat(transferERC20ABI)
    .concat(getERC20ABI)
    .concat(safeTransferChildABI)
    .concat(safeTransferFrom1155ABI)
    .concat(safeTransferFrom721ABI);

  const metaComposeFn = useMetamask((data: IToken, values: IComposeTokenDto, web3Context: Web3ContextType) => {
    const contractType = data.template!.contract!.contractType;

    const contract = new Contract(token.template!.contract!.address, ERC998ABI, web3Context.provider?.getSigner());

    switch (contractType) {
      case TokenType.ERC20: // ERC20
        return contract.getERC20(
          web3Context.account,
          token.tokenId,
          data.template!.contract!.address,
          values.amount,
        ) as Promise<void>;

      case TokenType.ERC1155: // ERC1155
        return contract.safeTransferFrom(
          web3Context.account,
          token.template!.contract!.address,
          data.tokenId,
          values.amount,
          utils.hexZeroPad(BigNumber.from(token.tokenId).toHexString(), 32),
        ) as Promise<void>;

      case TokenType.ERC721: // ERC721
      case TokenType.ERC998: // ERC998
        return contract["safeTransferFrom(address,address,uint256,bytes)"](
          web3Context.account,
          token.template!.contract!.address,
          data.tokenId,
          utils.hexZeroPad(BigNumber.from(token.tokenId).toHexString(), 32),
        ) as Promise<void>;
      default:
        return Promise.resolve("") as Promise<any>;
    }
  });

  const metaDecomposeFn = useMetamask((data: IToken, values: IComposeTokenDto, web3Context: Web3ContextType) => {
    const contractType = data.template!.contract!.contractType;

    const contract = new Contract(token.template!.contract!.address, ERC998ABI, web3Context.provider?.getSigner());

    switch (contractType) {
      case TokenType.ERC20: // ERC20
        return contract.transferERC20(
          token.tokenId,
          web3Context.account,
          data.template!.contract!.address,
          values.amount,
        ) as Promise<void>;
      case TokenType.ERC1155: // ERC1155
        return contract.safeTransferFromERC1155(
          token.tokenId,
          web3Context.account,
          data.template!.contract!.address,
          data.tokenId,
          values.amount,
          "0x",
        ) as Promise<void>;
      case TokenType.ERC721: // ERC721
      case TokenType.ERC998: // ERC998
        return contract["safeTransferChild(uint256,address,address,uint256)"](
          token.tokenId,
          web3Context.account,
          token.balance![0].token!.template!.contract!.address,
          token.balance![0].token?.tokenId,
        ) as Promise<void>;
      default:
        return Promise.resolve("") as Promise<any>;
    }
  });

  const handleComposeToken = (): void => {
    setIsComposeTokenDialogOpen(true);
  };

  const postponeAction = (token: IToken, metaFn: (...args: Array<any>) => Promise<any>) => {
    if (
      token.template!.contract!.contractType === TokenType.ERC20 ||
      token.template!.contract!.contractType === TokenType.ERC1155
    ) {
      setAction({ token, metaFn });
      handleComposeToken();
    } else {
      void metaFn(token, {});
    }
  };

  const handleComposeTokenConfirm = async (values: IComposeTokenDto): Promise<void> => {
    await action.metaFn(action.token, values).finally(() => {
      setIsComposeTokenDialogOpen(false);
    });
  };

  const handleComposeTokenCancel = (): void => {
    setIsComposeTokenDialogOpen(false);
  };

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    postponeAction(option, metaComposeFn);
  };

  const handleClear = (balance: IBalance) => () => {
    postponeAction(balance.token!, metaDecomposeFn);
  };

  if (!token.template?.contract?.children?.length) {
    return null;
  }

  return (
    <Fragment>
      <Typography variant="h4">Composed tokens</Typography>

      {token.template?.contract?.children?.map(child => {
        const filtered = token.balance!.filter(balance => balance.token?.template?.contractId === child.childId); // token.children!.filter(ownership => ownership.child?.template?.contractId === child.childId);

        return (
          <FormWrapper
            key={child.id}
            initialValues={filtered.reduce(
              (memo, current, i) => {
                memo.tokenId[i] = formatTokenTitle(filtered[i].token!);
                return memo;
              },
              { tokenId: [] as Array<string> },
            )}
            onSubmit={Promise.resolve}
            showButtons={false}
            showPrompt={false}
            testId="TokenCompositionDialog"
          >
            <StyledTitle variant="h5">{child.child?.title}</StyledTitle>
            {new Array(filtered.length).fill(null).map((e, i) => (
              <StaticInput
                key={i}
                name={`tokenId[${i}]`}
                label={formatMessage({ id: "form.labels.tokenId" })}
                placeholder={formatMessage({ id: "form.placeholders.tokenId" })}
                InputProps={{
                  endAdornment: (
                    <StyledInputAdornment position="end">
                      <IconButton onClick={handleClear(filtered[i])} edge="end" size="small">
                        <Clear fontSize="inherit" />
                      </IconButton>
                    </StyledInputAdornment>
                  ),
                }}
              />
            ))}
            {new Array(child.amount - filtered.length).fill(null).map((e, i) => (
              <EntityInput
                disableClear={true}
                key={i}
                name={`tokenId[${i + filtered.length}]`}
                controller="tokens"
                data={{
                  contractIds: [child.child?.id],
                }}
                label={formatMessage({ id: "form.labels.tokenId" })}
                placeholder={formatMessage({ id: "form.placeholders.tokenId" })}
                getTitle={(token: IToken) => formatTokenTitle(token)}
                onChange={handleChange}
              />
            ))}
          </FormWrapper>
        );
      })}

      <ComposeTokenDialog
        onCancel={handleComposeTokenCancel}
        onConfirm={handleComposeTokenConfirm}
        open={isComposeTokenDialogOpen}
        initialValues={{
          amount: "0",
          decimals: action.token?.template?.contract?.decimals || 0,
        }}
      />
    </Fragment>
  );
};
