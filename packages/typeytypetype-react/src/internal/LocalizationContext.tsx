import { createContext } from 'react';
import { type Localizer } from '../types.js';

export const LocalizationContext = createContext<Localizer>(
    (displayName) => displayName
);
