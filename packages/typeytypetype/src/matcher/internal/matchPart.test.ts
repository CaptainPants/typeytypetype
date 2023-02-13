import { expect, test } from '@jest/globals';
import { Type } from '../../definitions';
import { matchPart } from './matchPart.js';

test('label', async () => {
    expect(
        matchPart(Type.number().addLabel('test-label'), {
            type: 'label',
            label: 'test-label',
        })
    ).toStrictEqual(true);
    expect(
        matchPart(Type.number().addLabels('test-label-2', 'test-label'), {
            type: 'label',
            label: 'test-label',
        })
    ).toStrictEqual(true);

    expect(
        matchPart(Type.number().addLabel('label1'), {
            type: 'label',
            label: 'label1-suffix',
        })
    ).toStrictEqual(false);
    expect(
        matchPart(Type.number(), { type: 'label', label: 'test-label' })
    ).toStrictEqual(false);
});

test('attribute', async () => {
    expect(
        matchPart(Type.number().addAttribute('type', 'ham-sandwich'), {
            type: 'attr',
            name: 'type',
            value: 'ham-sandwich',
        })
    ).toStrictEqual(true);
    expect(
        matchPart(Type.number(), {
            type: 'attr',
            name: 'type',
            value: 'ham-sandwich',
        })
    ).toStrictEqual(false);
    expect(
        matchPart(
            Type.number()
                .addAttribute('type', 'ham-sandwich')
                .addAttribute('other', 'thing'),
            { type: 'attr', name: 'type', value: 'ham-sandwich' }
        )
    ).toStrictEqual(true);
});
