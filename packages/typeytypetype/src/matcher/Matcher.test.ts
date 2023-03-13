import { expect, test } from '@jest/globals';
import { Types } from '../types/Types.js';
import { StandardModelFactory } from '../models/StandardModelFactory.js';
import { type DefinitionNode } from '../types/parents.js';
import { createTypeMatcher } from './createTypeMatcher.js';
import { matchDefinitionRule } from './internal/matchModelRule.js';
import { Matcher } from './Matcher.js';
import { Rules } from './Rules.js';
import { type TypeMatcherRule } from './types.js';

test('test', async () => {
    const rules: Array<TypeMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rules.label('1'),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rules.label('2'),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = new Matcher<TypeMatcherRule<number>, DefinitionNode>(
        rules,
        matchDefinitionRule
    );

    const numDefinition1 = Types.number().withLabels('2').freeze();
    const numDefinition2 = Types.number().withLabels('1').freeze();
    const numDefinition3 = Types.number().withLabels('3').freeze();

    const match1 = matcher.findBestMatch({ type: numDefinition1 });
    const match2 = matcher.findBestMatch({ type: numDefinition2 });
    const match3 = matcher.findBestMatch({ type: numDefinition3 });

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);

    expect(match2?.name).toStrictEqual('rule1');
    expect(match2?.result).toStrictEqual(1);

    expect(match3).toStrictEqual(null);
});

test('ordered', async () => {
    const rules: Array<TypeMatcherRule<number>> = [
        {
            name: 'rule1',
            matches: Rules.label('1'),
            priority: 0,
            result: 1,
        },
        {
            name: 'rule2',
            matches: Rules.label('1'),
            priority: 0,
            result: 2,
        },
    ];

    const matcher = createTypeMatcher(rules);

    const factory = new StandardModelFactory();
    const numModel1 = await factory.createModel({
        value: 2,
        type: Types.number().withLabels('1').freeze(),
    });

    const match1 = matcher.findBestMatch(numModel1);

    expect(match1?.name).toStrictEqual('rule2');
    expect(match1?.result).toStrictEqual(2);
});

function createRule(
    id: string,
    label: string,
    priority: number
): TypeMatcherRule<string> {
    return {
        name: `rule-${id}`,
        matches: Rules.label(label),
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

    const matcher = createTypeMatcher(rules);

    const factory = new StandardModelFactory();

    const model = await factory.createModel({
        type: Types.number().withLabel('2'),
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
