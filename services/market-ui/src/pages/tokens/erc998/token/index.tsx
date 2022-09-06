import { ChangeEvent, FC, Fragment, useState } from "react";
import { Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";

import { FormattedMessage, useIntl } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ContractFeatures, ITemplate, IToken, TokenType } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { FormWrapper } from "@gemunion/mui-form";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
// import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
// TODO make real 998Full.sol
import ERC998FullSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155ERC20Simple.sol/ERC998ERC1155ERC20Simple.json";

import { useStyles } from "./styles";
import { TokenSellButton, UpgradeButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { Clear } from "@mui/icons-material";
import { IOwnership } from "@framework/types/dist/entities/blockchain/hierarchy/ownership";
import { ComposeTokenDialog, IComposeTokenDto } from "./dialog";

export interface IComposition {
  token: IToken;
  metaFn: (...args: Array<any>) => Promise<any>;
}

export const Erc998Token: FC = () => {
  const [action, setAction] = useState<IComposition>({} as IComposition);
  const [isComposeTokenDialogOpen, setIsComposeTokenDialogOpen] = useState(false);

  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc998-tokens",
    empty: {
      template: {
        title: "",
        description: emptyStateString,
      } as ITemplate,
    },
  });

  const { formatMessage } = useIntl();
  const classes = useStyles();

  const metaComposeFn = useMetamask((data: IToken, values: IComposeTokenDto, web3Context: Web3ContextType) => {
    const contractType = data.template!.contract!.contractType;
    const contractAbi =
      contractType === TokenType.ERC1155
        ? ERC1155SimpleSol.abi
        : contractType === TokenType.ERC721
        ? ERC721SimpleSol.abi
        : ERC20SimpleSol.abi; // ERC20

    const contract = new Contract(data.template!.contract!.address, contractAbi, web3Context.provider?.getSigner());

    const contract998 = new Contract(
      selected.template!.contract!.address,
      ERC998FullSol.abi,
      web3Context.provider?.getSigner(),
    );

    if (contractType === TokenType.ERC721) {
      return contract["safeTransferFrom(address,address,uint256,bytes)"](
        web3Context.account,
        selected.template!.contract!.address,
        data.tokenId,
        utils.hexZeroPad(BigNumber.from(selected.tokenId).toHexString(), 32),
      ) as Promise<void>;
    } else if (contractType === TokenType.ERC1155) {
      return contract.safeTransferFrom(
        web3Context.account,
        selected.template!.contract!.address,
        data.tokenId,
        values.amount,
        utils.hexZeroPad(BigNumber.from(selected.tokenId).toHexString(), 32),
      ) as Promise<void>;
    } else {
      // ERC20
      return contract998.getERC20(
        web3Context.account,
        selected.tokenId,
        data.template!.contract!.address,
        values.amount,
      ) as Promise<void>;
    }
  });

  const metaDecomposeFn = useMetamask((data: IToken, values: IComposeTokenDto, web3Context: Web3ContextType) => {
    const contractType = data.template!.contract!.contractType;

    const contract = new Contract(
      selected.template!.contract!.address,
      ERC998FullSol.abi,
      web3Context.provider?.getSigner(),
    );
    if (contractType === TokenType.ERC1155) {
      return contract.safeTransferFromERC1155(
        selected.tokenId,
        web3Context.account,
        data.template!.contract!.address,
        data.tokenId,
        values.amount,
        "0x",
      ) as Promise<void>;
    } else if (contractType === TokenType.ERC20) {
      return contract.transferERC20(
        selected.tokenId,
        web3Context.account,
        data.template!.contract!.address,
        values.amount,
      ) as Promise<void>;
    } else {
      // ERC721 or ERC998
      return contract["safeTransferChild(uint256,address,address,uint256)"](
        selected.tokenId,
        web3Context.account,
        selected.children![0].child!.template!.contract!.address,
        selected.children![0].child?.tokenId,
      ) as Promise<void>;
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

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    postponeAction(option, metaComposeFn);
  };

  const handleClear = (ownership: IOwnership) => () => {
    postponeAction(ownership.child!, metaDecomposeFn);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998.tokens", "erc998.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc998.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
          <br />
          <br />
          <Typography variant="h4">Composed tokens</Typography>
          {selected.template?.contract?.children?.map(child => {
            const filtered = selected.children!.filter(
              ownership => ownership.child?.template?.contractId === child.childId,
            );

            return (
              <FormWrapper
                key={child.id}
                initialValues={filtered.reduce(
                  (memo, current, i) => {
                    memo.tokenId[i] = current.childId;
                    return memo;
                  },
                  { tokenId: [] as Array<number> },
                )}
                onSubmit={Promise.resolve}
                showButtons={false}
                showPrompt={false}
                testId="TokenCompositionDialog"
              >
                <Typography variant="h5" sx={{ mt: 3 }}>
                  {child.child?.title}
                </Typography>
                {new Array(filtered.length).fill(null).map((e, i) => (
                  <Grid container key={i}>
                    <Grid item xs={6}>
                      <EntityInput
                        disableClear={true}
                        key={i}
                        name={`tokenId[${i}]`}
                        controller="tokens"
                        data={{
                          account: selected.template?.contract?.address,
                          contractIds: [child.child?.id],
                        }}
                        label={formatMessage({ id: "form.labels.tokenId" })}
                        placeholder={formatMessage({ id: "form.placeholders.tokenId" })}
                        getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Tooltip title={formatMessage({ id: "form.tips.clear" })}>
                        <IconButton onClick={handleClear(filtered[i])} data-testid="ChildClearButton">
                          <Clear />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))}
                {new Array(child.amount - filtered.length).fill(null).map((e, i) => (
                  <Grid container key={i}>
                    <Grid item xs={6}>
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
                        getTitle={(token: IToken) => `${token.template!.title} #${token.tokenId}`}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                ))}
              </FormWrapper>
            );
          })}
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>
              <FormattedMessage
                id="pages.erc998.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc998.token.level" values={selected.attributes} />
              </Typography>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>

      <ComposeTokenDialog
        onCancel={handleComposeTokenCancel}
        onConfirm={handleComposeTokenConfirm}
        open={isComposeTokenDialogOpen}
        initialValues={{
          amount: "0",
          decimals: action.token.template!.contract!.decimals,
        }}
      />
    </Fragment>
  );
};
