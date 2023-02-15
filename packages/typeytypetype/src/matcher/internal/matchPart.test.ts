import { expect, test } from '@jest/globals';
import { Type } from '../../definitions';
import { StandardModelFactory } from '../../models';
import { matchPart } from './matchPart.js';

test('label', async () => {
    const factory = new StandardModelFactory();

    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number().withLabels('test-label'),
                depth: 25,
            }),
            {
                $label: 'test-label',
            }
        )
    ).toStrictEqual(true);
    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number().withLabels('test-label'),
                depth: 25,
            }),
            {
                $label: 'test-label',
            }
        )
    ).toStrictEqual(true);

    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number().withLabels('label1'),
                depth: 25,
            }),
            {
                $label: 'label1-suffix',
            }
        )
    ).toStrictEqual(false);
    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number(),
                depth: 25,
            }),
            { $label: 'test-label' }
        )
    );
});

test('attribute', async () => {
    const factory = new StandardModelFactory();

    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number().withAttr('type', 'ham-sandwich'),
                depth: 25,
            }),
            {
                $attr: 'type',
                value: 'ham-sandwich',
            }
        )
    ).toStrictEqual(true);
    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number(),
                depth: 25,
            }),
            {
                $attr: 'type',
                value: 'ham-sandwich',
            }
        )
    ).toStrictEqual(false);
    expect(
        matchPart(
            factory.create({
                value: 1,
                definition: Type.number()
                    .withAttr('type', 'ham-sandwich')
                    .withAttr('other', 'thing'),
                depth: 25,
            }),
            { $attr: 'type', value: 'ham-sandwich' }
        )
    ).toStrictEqual(true);
});
