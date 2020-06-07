import { DecoderResponse, FetchFunction, IotsFetchFunction, IotsResponseInit, IotsRequestInit } from './types';
import { RequestInfo, Response, BodyInit } from 'node-fetch';
import originalFetch from 'node-fetch';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Decoder, Errors } from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

export class DecodeFetchError extends Error 
{}

export class IotsResponse<I, T> extends Response implements DecoderResponse<T> {
  private decoder?: Decoder<I, T>;

  constructor(body?: BodyInit, init?: IotsResponseInit<I, T>) {
    super(body, init);

    this.decoder = init?.decoder;
  }

  public async decode(): Promise<T> {
    if (! this.decoder) {
      throw Error('Decoder not defined.');
    }

    const jsonObject = await this.json();

    return pipe(
      this.decoder.decode(jsonObject),
      fold(
          (errors: Errors) => { throw new DecodeFetchError(failure(errors).join('\n')) },
          (value: T): T => value,
      ),
    );
  }
}

export const wrapper = <I, T>(fetch: FetchFunction): IotsFetchFunction<I, T> => {
  return async <I, T>(url: RequestInfo, init?: IotsRequestInit<I, T>): Promise<DecoderResponse<T>> => {
    const response = await fetch(url, init);
    
    return new IotsResponse(response.body, init);
  };
};

export default  wrapper(originalFetch);
