import { useIntl } from "react-intl";

export const useRatePlans = () => {
  const { formatMessage } = useIntl();

  return [
    {
      title: formatMessage({ id: "pages.ratePlan.bronze" }),
      price: "2000 $",
      features: [
        { name: "1 ERC20 contract", included: true },
        { name: "5 ERC721 contracts", included: true },
        { name: "5 ERC1155 contracts", included: true },
        { name: "1000 vesting contracts", included: true },
        { name: "Mass transact", included: true },
        { name: "WaitList", included: true },
        { name: "Claim", included: true },
        { name: "Grade", included: true },
        { name: "Craft", included: true },
        { name: "MysteryBox", included: false },
        { name: "Raffle", included: false },
      ],
    },
    {
      title: formatMessage({ id: "pages.ratePlan.silver" }),
      price: "5000 $",
      features: [
        { name: "1 ERC20 contract", included: true },
        { name: "10 ERC721 contracts", included: true },
        { name: "10 ERC1155 contracts", included: true },
        { name: "3000 vesting contracts", included: true },
        { name: "Mass transact", included: true },
        { name: "WaitList", included: true },
        { name: "Claim", included: true },
        { name: "Grade", included: true },
        { name: "Craft", included: true },
        { name: "MysteryBox", included: true },
        { name: "Raffle", included: true },
      ],
    },
    {
      title: formatMessage({ id: "pages.ratePlan.gold" }),
      price: "7000 $",
      features: [
        { name: "5 ERC20 contract", included: true },
        { name: "25 ERC721 contracts", included: true },
        { name: "25 ERC1155 contracts", included: true },
        { name: "5000 vesting contracts", included: true },
        { name: "Mass transact", included: true },
        { name: "WaitList", included: true },
        { name: "Claim", included: true },
        { name: "Grade", included: true },
        { name: "Craft", included: true },
        { name: "MysteryBox", included: true },
        { name: "Raffle", included: true },
      ],
    },
  ];
};
