export interface INestedProperty {
    property: string | number,
    children?: Array<INestedProperty>,
    constraints?: Record<string, string>
}

export interface IValidationError {
    target: any,
    property: string | number,
    children: Array<IValidationError>,
    value: any,
    constraints?: Record<string, string>
}

export const createNestedValidationError = (target: any, properyPath: Array<string> = [], childrens: Array<INestedProperty>): IValidationError[] => {
    if (properyPath.length) {
        const property = properyPath[0];
        const value = target[property];
        return [
            {
                target,
                property,
                value,
                children: createNestedValidationError(value, properyPath.slice(1), childrens),
            }
        ]
    }

    return childrens.map(child => {
        const { property, children = [], constraints } = child;
        const value = target[property];
        return {
            target,
            property,
            value,
            constraints,
            children: createNestedValidationError(value, [], children),
        }
    })
} 