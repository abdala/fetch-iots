# Fetch io-ts

Wapper around `node-fetch` libray to decode (unserialize) responses using io-ts

## Setup
```js
import fetch from 'fetch-iots';
import * as iots from 'io-ts';

const SampleType = iots.type({
    data: iots.string,
    method: iots.string,
});
type SampleType = iots.TypeOf<typeof SampleType>;

void (async () => {
    const jsonResponse = await fetch('https://httpbin.org/anything', {
        decoder: SampleType,
    });
    console.log(await jsonResponse.decode());
})();
```

## Custom wrapper
```js
import nodeFetch from 'node-fetch';
import { wrapper } from 'fetch-iots';

const nodeFetchResponse = await wrapper(nodeFetch)('https://httpbin.org/get');
console.log(await nodeFetchResponse.json());
```