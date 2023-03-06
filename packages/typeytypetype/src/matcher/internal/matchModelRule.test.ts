import { expect, test } from '@jest/globals';
import { Type } from '../../definitions';
import { StandardModelFactory } from '../../models';
import { Rule } from '../Rule.js';
import { matchModelRulePart } from './matchModelRule.js';

test('label', async () => {
    const factory = new StandardModelFactory();

    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withLabels('test-label'),
            }),
            Rule.label('test-label')
        )
    ).toStrictEqual(true);
    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withLabels('test-label'),
            }),
            Rule.label('test-label')
        )
    ).toStrictEqual(true);

    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withLabels('label1'),
            }),
            Rule.label('label1-suffix')
        )
    ).toStrictEqual(false);
    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number(),
            }),
            Rule.label('test-label')
        )
    );
});

test('attribute', async () => {
    const factory = new StandardModelFactory();

    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withAttr('type', 'ham-sandwich'),
            }),
            Rule.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(true);
    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number(),
            }),
            Rule.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(false);
    expect(
        matchModelRulePart(
            await factory.createModel({
                value: 1,
                definition: Type.number()
                    .withAttr('type', 'ham-sandwich')
                    .withAttr('other', 'thing'),
            }),
            Rule.attr('type', 'ham-sandwich')
        )
    ).toStrictEqual(true);
});
