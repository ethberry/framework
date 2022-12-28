import { all, create } from "mathjs";
import { BigNumber } from "ethers";

const createTemplateFunction = <T extends (arg?: string) => any>(cb: T) => {
  return (...templateLiteral: Parameters<typeof String.raw>): ReturnType<T> => {
    const str = String.raw(...templateLiteral);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cb(str);
  };
};

const mathjs = create(all, {
  number: "BigNumber",
  precision: 20,
});

// example use:
// math`0.23900923902348092834092830948 + 0.0000000000000000000005`
const calcFunc = createTemplateFunction(equation => {
  return mathjs.format(mathjs.evaluate(equation!), {
    notation: "fixed",
  });
});

const calcBFunc = createTemplateFunction(numStr =>
  BigNumber.from(mathjs.format(mathjs.evaluate(numStr!), { notation: "fixed" })),
);

const calcBNFunc = createTemplateFunction(numStr =>
  BigNumber.from(mathjs.format(mathjs.evaluate(numStr!), { notation: "fixed" })),
);

export const calc = calcFunc as typeof calcFunc & {
  B: typeof calcBFunc;
  BN: typeof calcBNFunc;
  math: typeof mathjs;
};

calc.B = calcBFunc;
calc.BN = calcBNFunc;
calc.math = mathjs;

// USAGE: math`200 > 300`
