import { expect, test } from '@jest/globals';
import { Type } from '../../definitions';
import { StandardModelFactory } from '../../models';
import { matchPart } from './matchPart.js';

test('label', async () => {
    const factory = new StandardModelFactory();

    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withLabels('test-label'),
            }),
            {
                $label: 'test-label',
            }
        )
    ).toStrictEqual(true);
    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withLabels('test-label'),
            }),
            {
                $label: 'test-label',
            }
        )
    ).toStrictEqual(true);

    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withLabels('label1'),
            }),
            {
                $label: 'label1-suffix',
            }
        )
    ).toStrictEqual(false);
    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number(),
            }),
            { $label: 'test-label' }
        )
    );
});

test('attribute', async () => {
    const factory = new StandardModelFactory();

    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number().withAttr('type', 'ham-sandwich'),
            }),
            {
                $attr: 'type',
                value: 'ham-sandwich',
            }
        )
    ).toStrictEqual(true);
    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number(),
            }),
            {
                $attr: 'type',
                value: 'ham-sandwich',
            }
        )
    ).toStrictEqual(false);
    expect(
        matchPart(
            await factory.createModel({
                value: 1,
                definition: Type.number()
                    .withAttr('type', 'ham-sandwich')
                    .withAttr('other', 'thing'),
            }),
            { $attr: 'type', value: 'ham-sandwich' }
        )
    ).toStrictEqual(true);
});
