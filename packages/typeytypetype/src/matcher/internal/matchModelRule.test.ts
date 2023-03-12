import { expect, test } from '@jest/globals';
import { Type } from '../../definitions';
import { Rule } from '../Rule.js';
import { matchDefinitionRulePart } from './matchModelRule.js';

test('label', async () => {
    expect(
        matchDefinitionRulePart(
            { definition: Type.number().withLabels('test-label') },
            Rule.label('test-label')
        )
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { definition: Type.number().withLabels('test-label') },
            Rule.label('test-label')
        )
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { definition: Type.number().withLabels('label1') },
            Rule.label('label1-suffix')
        )
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { definition: Type.number() },
            Rule.label('test-label')
        )
    );
});

test('attribute', async () => {
    expect(
        matchDefinitionRulePart(
            { definition: Type.number().withAttr('type', 'ham-sandwich') },
            Rule.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { definition: Type.number() },
            Rule.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            {
                definition: Type.number()
                    .withAttr('type', 'ham-sandwich')
                    .withAttr('other', 'thing'),
            },
            Rule.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(true);
});
