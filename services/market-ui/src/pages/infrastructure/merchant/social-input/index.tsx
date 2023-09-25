import { FC } from "react";

import { TextInput } from "@gemunion/mui-inputs-core";

import { StyledPaper } from "./styled";

export interface ISocialInputProps {
  name: string;
}

export const SocialInput: FC<ISocialInputProps> = props => {
  const { name } = props;
  return (
    <StyledPaper>
      <TextInput name={`${name}.twitterUrl`} />
      <TextInput name={`${name}.instagramUrl`} />
      <TextInput name={`${name}.youtubeUrl`} />
      <TextInput name={`${name}.facebookUrl`} />
    </StyledPaper>
  );
};
