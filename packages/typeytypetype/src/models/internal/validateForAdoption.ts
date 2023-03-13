import { type Type } from '../../types/Type.js';
import { isModel } from '../is.js';

export async function validateForAdoption<T>(
    valueOrModel: unknown,
    type: Type<T>
): Promise<T> {
    if (isModel(valueOrModel)) {
        if (valueOrModel.unknownType === type) {
            return valueOrModel as T;
        } else {
            return await type.validateAndThrow(valueOrModel);
        }
    } else {
        return await type.validateAndThrow(valueOrModel);
    }
}
