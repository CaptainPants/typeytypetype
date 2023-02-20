import { type Definition } from '../../definitions';
import { isModel } from '../isModel.js';

export async function adoptAndValidate<T>(
    valueOrModel: unknown,
    definition: Definition<T>
): Promise<T> {
    if (isModel(valueOrModel)) {
        if (valueOrModel.unknownDefinition === definition) {
            return valueOrModel as T;
        } else {
            return await definition.validateAndTypeAssert(valueOrModel);
        }
    } else {
        return await definition.validateAndTypeAssert(valueOrModel);
    }
}
