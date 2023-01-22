import { Type } from './Type.js';
import { TypeFromDefinition } from './types.js';

const model1 = Type.string();

const model2 = Type.union(Type.constant('test1'), Type.constant('test2'));

const model3 = Type.object({
    test1: Type.constant('Example'),
});

const model4 = Type.object({
    test2: Type.number(),
    complex: model2,
});

// There is no intersection here
const model5 = Type.intersect(model3, model4);

const model6 = Type.array(Type.constant(1));

type X = TypeFromDefinition<typeof model2>;

interface Test {
    id: number;
    child: Test | null;
}
const TestModel = Type.named<Test>('Test');
TestModel.definition = Type.object({
    id: Type.number(),
    child: Type.union(TestModel, Type.null()),
});