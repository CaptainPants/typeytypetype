
import { Type } from './Type';

const model1 = Type.string();

const model2 = Type.union(
    Type.string('test'),
    Type.string('thing')
);

// There is no intersection here
const model3 = Type.intersect(
    Type.string('test'),
    Type.string('thing')
);
