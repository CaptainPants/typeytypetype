import { expect, test } from '@jest/globals';
import { Types } from '../../types/index.js';
import { Rules } from '../Rules.js';
import { matchDefinitionRulePart } from './matchModelRule.js';

test('label', async () => {
    expect(
        matchDefinitionRulePart(
            { type: Types.number().withLabels('test-label') },
            Rules.label('test-label')
        )
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { type: Types.number().withLabels('test-label') },
            Rules.label('test-label')
        )
    ).toStrictEqual(true);

    expect(
        matchDefinitionRulePart(
            { type: Types.number().withLabels('label1') },
            Rules.label('label1-suffix')
        )
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            { type: Types.number() },
            Rules.label('test-label')
        )
    );
});

test('attribute', async () => {
    expect(
        matchDefinitionRulePart(
            { type: Types.number().withAttr('type', 'ham-sandwich') },
            Rules.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(true);
    expect(
        matchDefinitionRulePart(
            { type: Types.number() },
            Rules.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(false);
    expect(
        matchDefinitionRulePart(
            {
                type: Types.number()
                    .withAttr('type', 'ham-sandwich')
                    .withAttr('other', 'thing'),
            },
            Rules.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(true);
});
