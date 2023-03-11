import { useContext } from 'react';
import { LocalizationContext } from '../internal/LocalizationContext.js';
import { type Localizer } from '../types.js';

export function useLocalizer(): Localizer {
    return useContext(LocalizationContext);
}
