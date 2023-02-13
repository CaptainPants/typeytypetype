import { expect, test } from '@jest/globals';
import { Type } from '../../definitions';
import { matchPart } from './matchPart.js';

test('label', async () => {
    expect(
        matchPart(Type.number().withLabels('test-label'), {
            $label: 'test-label',
        })
    ).toStrictEqual(true);
    expect(
        matchPart(Type.number().withLabels('test-label-2', 'test-label'), {
            $label: 'test-label',
        })
    ).toStrictEqual(true);

    expect(
        matchPart(Type.number().withLabels('label1'), {
            $label: 'label1-suffix',
        })
    ).toStrictEqual(false);
    expect(matchPart(Type.number(), { $label: 'test-label' })).toStrictEqual(
        false
    );
});

test('attribute', async () => {
    expect(
        matchPart(Type.number().withAttr('type', 'ham-sandwich'), {
            $attr: 'type',
            value: 'ham-sandwich',
        })
    ).toStrictEqual(true);
    expect(
        matchPart(Type.number(), {
            $attr: 'type',
            value: 'ham-sandwich',
        })
    ).toStrictEqual(false);
    expect(
        matchPart(
            Type.number()
                .withAttr('type', 'ham-sandwich')
                .withAttr('other', 'thing'),
            { $attr: 'type', value: 'ham-sandwich' }
        )
    ).toStrictEqual(true);
});
