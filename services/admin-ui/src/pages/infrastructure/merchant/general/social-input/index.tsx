import { FC } from "react";
import { Paper } from "@mui/material";

import { TextInput } from "@gemunion/mui-inputs-core";

export interface ISocialInputProps {
  name: string;
}

export const SocialInput: FC<ISocialInputProps> = props => {
  const { name } = props;
  return (
    <Paper sx={{ mt: 2, mb: 2, p: 2 }}>
      <TextInput name={`${name}.twitterUrl`} />
      <TextInput name={`${name}.instagramUrl`} />
      <TextInput name={`${name}.youtubeUrl`} />
      <TextInput name={`${name}.facebookUrl`} />
    </Paper>
  );
};
