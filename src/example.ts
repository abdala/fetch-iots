import fetch from './fetch';
import * as iots from 'io-ts';

const SampleType = iots.type({
    url: iots.string,
    method: iots.string,
});
type SampleType = iots.TypeOf<typeof SampleType>;

void (async () => {
    const jsonResponse = await fetch('https://httpbin.org/anything', {
        decoder: SampleType,
    });
    console.log(await jsonResponse.decode());
})();
