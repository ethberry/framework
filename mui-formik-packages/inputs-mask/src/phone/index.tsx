import { FC } from "react";

import { MaskedInput } from "../mask";

export interface IPhoneInputProps {
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PhoneInput: FC<IPhoneInputProps> = props => {
  return (
    <MaskedInput
      mask={[
        {
          mask: "+0 (000) 000-00-00", // +1 (512) 955-41-29
          startsWith: "1",
          lazy: false,
          country: "United States",
        },
        {
          mask: "+0 (000) 000-00-00",
          startsWith: "7",
          lazy: false,
          country: "Russia",
        },
        {
          mask: "+00 (000) 000-00-00", // +38 (067) 868-21-83
          startsWith: "38",
          lazy: false,
          country: "Ukraine",
        },
        {
          mask: "+00 (000) 0000-0000", // +62 (812) 3919-8760
          startsWith: "62",
          lazy: false,
          country: "Indonesia",
        },
        {
          mask: "0000000000000",
          startsWith: "",
          country: "unknown",
        },
      ]}
      dispatch={(appended: string, dynamicMasked: any) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const number = `${dynamicMasked.value}${appended}`.replace(/\D/g, "");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return dynamicMasked.compiledMasks.find((m: any) => {
          return number.indexOf(m.startsWith) === 0;
        });
      }}
      {...props}
    />
  );
};
