export interface IOpenSeaMetadataAttribute {
  display_type?: "number" | "boost_number" | "boost_percentage" | "date";
  trait_type?: string;
  max_value?: number;
  value: string | number;
}

// https://docs.opensea.io/docs/metadata-standards
export interface IOpenSeaTokenMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes?: Array<IOpenSeaMetadataAttribute>;
}

// https://docs.opensea.io/docs/contract-level-metadata
export interface IOpenSeaContractMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
}
