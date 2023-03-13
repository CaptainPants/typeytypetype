import { createContext } from 'react';
import { type Localizer } from '../types.js';

// todo: placeholder replaces

export const LocalizationContext = createContext<Localizer>(
    (displayName) => displayName
);
