import { useIntl } from "react-intl";

export const useProductTypes = () => {
  const { formatMessage } = useIntl();

  return [
    {
      title: formatMessage({ id: "components.productTypes.saas.title" }),
      text: formatMessage({ id: "components.productTypes.saas.text" }),
      link: `${process.env.GEMUNION_URL}/calculator-saas`,
      linkTitle: formatMessage({ id: "components.productTypes.saas.linkTitle" }),
    },
    {
      title: formatMessage({ id: "components.productTypes.standalone.title" }),
      text: formatMessage({ id: "components.productTypes.standalone.text" }),
      link: `${process.env.GEMUNION_URL}/calculator`,
      linkTitle: formatMessage({ id: "components.productTypes.standalone.linkTitle" }),
    },
    {
      title: formatMessage({ id: "components.productTypes.enterprise.title" }),
      text: formatMessage({ id: "components.productTypes.enterprise.text" }),
      link: `${process.env.GEMUNION_URL}/contact-enterprise`,
      linkTitle: formatMessage({ id: "components.productTypes.enterprise.linkTitle" }),
    },
  ];
};
