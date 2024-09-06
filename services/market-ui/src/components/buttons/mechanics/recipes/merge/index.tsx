import { FC, Fragment, useState } from "react";
import { JoinFull } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { walletSelectors } from "@gemunion/provider-wallet";
import { useAllowance, useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { convertDatabaseAssetToChainAsset, convertTemplateToTokenTypeAsset, sortArrObj } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import { IContract, IMerge, TokenType } from "@framework/types";

import ExchangeMergeFacetMergeABI from "@framework/abis/json/ExchangeMergeFacet/merge.json";

import { MergeDialog, IMergeDto } from "./dialog";

interface IMergeButtonProps {
  className?: string;
  disabled?: boolean;
  merge: IMerge;
  variant?: ListActionVariant;
}

export const MergeButton: FC<IMergeButtonProps> = props => {
  const { className, disabled, merge, variant = ListActionVariant.button } = props;

  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);

  const referrer = useAppSelector(walletSelectors.referrerSelector);

  const metaFnWithAllowance = useAllowance(
    (web3Context: Web3ContextType, values: IMergeDto, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeMergeFacetMergeABI,
        web3Context.provider?.getSigner(),
      );

      const encodedTemplateId = utils.hexZeroPad(
        BigNumber.from(merge.price?.components[0].templateId || 0).toHexString(),
        32,
      );

      const items = convertDatabaseAssetToChainAsset(merge.item?.components);

      const price = sortArrObj(values.tokenEntities, { sortBy: "tokenId" }).map(el => ({
        tokenId: el.tokenId,
        tokenType: Object.values(TokenType).indexOf(el.template!.contract!.contractType!),
        token: el.template?.contract?.address,
        amount: "1",
      }));

      return contract.merge(
        {
          externalId: merge.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: encodedTemplateId,
          receiver: merge.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        items,
        price,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const metaFnWithSign = useServerSignature(
    async (values: IMergeDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const price = sortArrObj(values.tokenEntities, { sortBy: "tokenId" }).map(el =>
        convertTemplateToTokenTypeAsset(el.template),
      );

      return metaFnWithAllowance(
        { contract: systemContract.address, assets: price },
        web3Context,
        values,
        sign,
        systemContract,
      );
    },
  );

  const metaFn = useMetamask((values: IMergeDto, web3Context: Web3ContextType) => {
    return metaFnWithSign(
      {
        url: "/recipes/merge/sign",
        method: "POST",
        data: {
          referrer,
          mergeId: merge.id,
          tokenIds: values.tokenIds,
        },
      },
      values,
      web3Context,
    ) as Promise<void>;
  });

  const handleMerge = (): void => {
    setIsMergeDialogOpen(true);
  };

  const handleMergeConfirm = async (dto: IMergeDto) => {
    await metaFn(dto);
    setIsMergeDialogOpen(false);
  };

  const handleMergeCancel = () => {
    setIsMergeDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        icon={JoinFull}
        onClick={handleMerge}
        message="form.buttons.merge"
        className={className}
        dataTestId="MergeButton"
        disabled={disabled}
        variant={variant}
      />
      <MergeDialog
        onConfirm={handleMergeConfirm}
        onCancel={handleMergeCancel}
        open={isMergeDialogOpen}
        message="dialogs.merge"
        merge={merge}
        initialValues={{
          tokens: new Array(parseInt(merge.price?.components[0].amount || "1")).fill({ tokenId: 0 }),
          tokenEntities: [],
          tokenIds: [],
        }}
      />
    </Fragment>
  );
};
