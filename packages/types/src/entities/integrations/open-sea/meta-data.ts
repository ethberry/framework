export interface IOpenSeaMetadataAttribute {
  display_type?: "number" | "boost_number" | "boost_percentage" | "date";
  trait_type?: string;
  max_value?: number;
  value: string | number;
}

// https://docs.opensea.io/docs/metadata-standards
export interface IOpenSeaTokenMetadata {
  image: string;
  image_data?: string;
  external_url: string;
  description: string;
  name: string;
  attributes?: Array<IOpenSeaMetadataAttribute>;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}

// https://docs.opensea.io/docs/contract-level-metadata
export interface IOpenSeaContractMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
}
