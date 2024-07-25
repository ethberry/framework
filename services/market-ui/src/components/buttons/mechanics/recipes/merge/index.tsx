import { FC, Fragment, useState } from "react";
import { JoinFull } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, constants, Contract, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { useAppSelector } from "@gemunion/redux";
import { walletSelectors } from "@gemunion/provider-wallet";
import { useMetamask, useServerSignature } from "@gemunion/react-hooks-eth";
import { getEthPrice } from "@framework/exchange";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IMerge } from "@framework/types";
import { TokenType } from "@framework/types";

import MergeABI from "@framework/abis/json/ExchangeMergeFacet/merge.json";

import { sorter } from "../../../../../utils/sorter";
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

  const metaFnWithSign = useServerSignature(
    (values: IMergeDto, web3Context: Web3ContextType, sign: IServerSignature, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, MergeABI, web3Context.provider?.getSigner());

      const encodedTemplateId = utils.hexZeroPad(
        BigNumber.from(merge.price?.components[0].templateId || 0).toHexString(),
        32,
      );
      return contract.merge(
        {
          externalId: merge.id,
          expiresAt: sign.expiresAt,
          nonce: utils.arrayify(sign.nonce),
          extra: encodedTemplateId,
          receiver: merge.merchant!.wallet,
          referrer: constants.AddressZero,
        },
        merge.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract!.address,
          tokenId:
            component.contract!.contractType === TokenType.ERC1155
              ? component.template!.tokens![0].tokenId
              : (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        values.tokenEntities?.sort(sorter("tokenId")).map(token => ({
          tokenType: Object.values(TokenType).indexOf(token.template!.contract!.contractType!),
          token: token.template!.contract!.address,
          tokenId: token.tokenId,
          amount: "1",
        })),
        sign.signature,
        {
          value: getEthPrice(merge.price),
        },
      ) as Promise<void>;
    },
    // { error: false },
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
