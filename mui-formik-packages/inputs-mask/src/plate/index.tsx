import { FC } from "react";
import { MaskedEnum } from "imask";

import { MaskedInput } from "../mask";

export interface IPlateInputProps {
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PlateInput: FC<IPlateInputProps> = props => {
  return (
    <MaskedInput
      mask={"#0[000]AA[A]"}
      definitions={{
        A: /[A-Z]/,
      }}
      blocks={{
        "#": {
          mask: MaskedEnum,
          // https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
          enum: ["DK"],
        },
      }}
      {...props}
    />
  );
};
