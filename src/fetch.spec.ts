import { wrapper, DecodeFetchError } from './fetch';
import { Response } from 'node-fetch';
import * as iots from 'io-ts';
import { IotsFetchFunction } from './types';

const SampleType = iots.type({
    name: iots.string
});
type SampleType = iots.TypeOf<typeof SampleType>;

describe('AWS v4 fetch wrapper', () => {
    let stubFetch: jest.Mock;
    let fetch:IotsFetchFunction<unknown, SampleType>;

    beforeEach(() => {
        stubFetch = jest.fn();
        fetch = wrapper(stubFetch);
    });

    it('Return original fetch response', async() => {
        const stubResponse = new Response('value');

        stubFetch.mockReturnValueOnce(stubResponse);

        const response = await fetch('http://example.site');
        
        await expect(response.text()).resolves.toEqual('value');
    });

    it('Decode a type', async() => {
        const stubResponse = new Response('{"name":"John"}');

        stubFetch.mockReturnValueOnce(stubResponse);

        const response = await fetch('http://example.site', {
            decoder: SampleType
        });

        await expect(response.decode()).resolves.toHaveProperty('name');
    });

    it('Fail when there is no decode defined', async() => {
        const stubResponse = new Response('');

        stubFetch.mockReturnValueOnce(stubResponse);

        const response = await fetch('http://example.site');

        await expect(response.decode()).rejects.toEqual(new DecodeFetchError('Decoder not defined.'));
    });
});