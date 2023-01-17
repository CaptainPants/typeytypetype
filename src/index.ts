import { Type } from "./Type";
import { TypeFromModel } from "./types";

const model1 = Type.string();

const model2 = Type.union(Type.value("test"), Type.value("thing"));

const model3 = Type.object({
  test1: Type.value("Example"),
});
const model4 = Type.object({
  test2: Type.value("Example"),
  complex: model2,
});

// There is no intersection here
const model5 = Type.intersect(model3, model4);

const model6 = Type.array(model5);

type X = TypeFromModel<typeof model6>;
