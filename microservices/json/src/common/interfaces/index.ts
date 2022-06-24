export interface IOpenSeaMetadataAttribute {
  display_type?: "number" | "boost_number" | "boost_percentage";
  trait_type?: string;
  max_value?: number;
  value: number;
}

export interface IOpenSeaMetadata {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes?: Array<IOpenSeaMetadataAttribute>;
}
