import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { StandardModelFactory } from '../models/StandardModelFactory.js';
import { Matcher } from './Matcher.js';
import { type MatcherRule } from './types.js';

test('test', async () => {
    const rules: Array<MatcherRule<number>> = [
        {
            name: 'rule1',
            parts: [{ $label: '1' }],
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            parts: [{ $label: '2' }],
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<number>(rules);

    const factory = new StandardModelFactory();
    const numModel1 = factory.create({
        value: 1,
        definition: Type.number().withLabels('2').freeze(),
        depth: 25,
    });
    const numModel2 = factory.create({
        value: 1,
        definition: Type.number().withLabels('1').freeze(),
        depth: 25,
    });

    const match1 = matcher.findMatch(numModel1);
    const match2 = matcher.findMatch(numModel2);

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);

    expect(match2?.name).toStrictEqual('rule1');
    expect(match2?.result).toStrictEqual(1);
});
