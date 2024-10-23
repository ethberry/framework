export interface INestedProperty {
  property: string | number;
  children?: Array<INestedProperty>;
  constraints?: Record<string, string>;
}

export interface IValidationError {
  target: any;
  property: string | number;
  children: Array<IValidationError>;
  value: any;
  constraints?: Record<string, string>;
}

export const createNestedValidationError = (
  target: any,
  propertyPath: Array<string> | string = [],
  children: Array<INestedProperty>,
): IValidationError[] => {
  return children.map(child => {
    const { property, children = [], constraints } = child;

    // propery can be set as item.components.contractId
    if (typeof property === "string" && property.includes(".")) {
      const newPath = property.split(".");
      // Set children propery as 'contractId'
      child.property = newPath.pop()!;
      // newPath already ['item', 'components']
      // we pass current target, newPath and current child with updated property 'contractId'
      return createNestedValidationError(target, newPath, [child])[0]; // We know that only first propertyPath would be executed
    }

    const value = target[property];

    return {
      target,
      property,
      value,
      constraints,
      children: createNestedValidationError(value, propertyPath, children),
    };
  });
};
