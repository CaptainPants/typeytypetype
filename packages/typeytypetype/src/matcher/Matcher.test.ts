import { expect, test } from '@jest/globals';
import { Type } from '../definitions/Type.js';
import { type Model } from '../models/Model.js';
import { StandardModelFactory } from '../models/StandardModelFactory.js';
import { createModelMatcher } from './createModelMatcher.js';
import { matchModelRule } from './internal/matchModelRule.js';
import { Matcher } from './Matcher.js';
import { Rule } from './Rule.js';
import { type ModelMatcherRule } from './types.js';

test('test', async () => {
    const rules: Array<ModelMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rule.label('1'),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rule.label('2'),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<ModelMatcherRule<number>, Model<unknown>>(
        rules,
        matchModelRule
    );

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

    const match1 = matcher.findBestMatch(numModel1);
    const match2 = matcher.findBestMatch(numModel2);
    const match3 = matcher.findBestMatch(numModel3);

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);

    expect(match2?.name).toStrictEqual('rule1');
    expect(match2?.result).toStrictEqual(1);

    expect(match3).toStrictEqual(null);
});

test('ordered', async () => {
    const rules: Array<ModelMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rule.label('1'),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rule.label('1'),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = createModelMatcher(rules);

    const factory = new StandardModelFactory();
    const numModel1 = await factory.createModel({
        value: 2,
        definition: Type.number().withLabels('1').freeze(),
    });

    const match1 = matcher.findBestMatch(numModel1);

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);
});

function createRule(
    id: string,
    label: string,
    priority: number
): ModelMatcherRule<string> {
    return {
        name: `rule-${id}`,
        matches: Rule.label(label),
        priority,
        result: id,
    };
}

test('multiple-ordered', async () => {
    const rules = [
        createRule('1', '1', 1),
        createRule('2', '1', 2),
        createRule('3', '1', 1),
        createRule('4', '1', 2),
        createRule('5', '2', 1),
        createRule('6', '2', 2),
        createRule('7', '2', 1),
        createRule('8', '2', 2),
    ];

    const matcher = createModelMatcher(rules);

    const factory = new StandardModelFactory();

    const model = await factory.createModel({
        definition: Type.number().withLabel('2'),
        value: 6,
    });

    const results = matcher.findAllMatches(model);

    const expected = [
        createRule('8', '2', 2),
        createRule('6', '2', 2),
        createRule('7', '2', 1),
        createRule('5', '2', 1),
    ];

    expect(results).toStrictEqual(expected);
});
