export interface IOpenSeaErc721MetadataAttribute {
  display_type?: "number" | "boost_number" | "boost_percentage";
  trait_type?: string;
  max_value?: number;
  value: number;
}

export interface IOpenSeaErc721Metadata {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes?: Array<IOpenSeaErc721MetadataAttribute>;
}

export interface IOpenSeaErc1155MetadataAttribute {
  display_type?: "number" | "boost_number" | "boost_percentage";
  trait_type?: string;
  max_value?: number;
  value: number;
}

export interface IOpenSeaErc1155Metadata {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes?: Array<IOpenSeaErc1155MetadataAttribute>;
}
