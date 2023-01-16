export interface Model<T> {
  metadata: unknown;
}

export type UnModel<TModel> = TModel extends Model<infer T> ? T : TModel;

type UnModelArray<T> = { [TKey in keyof T]: UnModel<T[TKey]> };

type MapModel<T> = {
    [TKey in keyof T]: Model<T[TKey]>;
}

type Intersect<TArgs extends readonly unknown[], TDepth extends readonly unknown[] = []> =
    TDepth['length'] extends 20 ? "Error" 
    : TArgs['length'] extends 1 ? TArgs[0]
    : TArgs extends [infer First, ...infer Rest] ? First & Intersect<Rest, [1, ...TDepth]> 
    : never;

export namespace Type {
  export function string<TString extends string = string>(
    values?: TString
  ): Model<TString> {
    throw "Not implemented";
  }

  export function union<TArgs extends readonly Model<unknown>[]>(
    ...models: TArgs
  ): Model<UnModelArray<TArgs>[number]> {
    throw "Not implemented";
  }

  export function intersect<TArgs extends readonly Model<unknown>[]>(
    ...models: TArgs
  ): MapModel<Intersect<UnModelArray<TArgs>>> {
    throw "Not implemented";
  }

  export function object<TPropsModel extends Record<string, Model<unknown>>>(properties: TPropsModel) {
    throw 'Not implemented';
  }
}

// 