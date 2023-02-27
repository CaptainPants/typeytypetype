import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { StandardModelFactory } from '../models/StandardModelFactory.js';
import { Matcher } from './Matcher.js';
import { Rule } from './Rule.js';
import { type MatcherRule } from './types.js';

test('test', async () => {
    const rules: Array<MatcherRule<number>> = [
        {
            name: 'rule1',
            parts: [Rule.label('1')],
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            parts: [Rule.label('2')],
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<number>(rules);

    const factory = new StandardModelFactory();
    const numModel1 = await factory.createModel({
        value: 2,
        definition: Type.number().withLabels('2').freeze(),
    });
    const numModel2 = await factory.createModel({
        value: 1,
        definition: Type.number().withLabels('1').freeze(),
    });
    const numModel3 = await factory.createModel({
        value: 3,
        definition: Type.number().withLabels('3').freeze(),
    });

    const match1 = matcher.findMatch(numModel1);
    const match2 = matcher.findMatch(numModel2);
    const match3 = matcher.findMatch(numModel3);

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);

    expect(match2?.name).toStrictEqual('rule1');
    expect(match2?.result).toStrictEqual(1);

    expect(match3).toStrictEqual(null);
});

test('ordered', async () => {
    const rules: Array<MatcherRule<number>> = [
        {
            name: 'rule1',
            parts: [Rule.label('1')],
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            parts: [Rule.label('1')],
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<number>(rules);

    const factory = new StandardModelFactory();
    const numModel1 = await factory.createModel({
        value: 2,
        definition: Type.number().withLabels('1').freeze(),
    });

    const match1 = matcher.findMatch(numModel1);

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);
});
