import { RequestInfo, RequestInit, Response, ResponseInit } from 'node-fetch';
import { Decoder } from 'io-ts';

export type FetchFunction = (url: RequestInfo, init?: RequestInit) => Promise<Response>;
export type IotsFetchFunction<I, T> = (url: RequestInfo, init?: IotsRequestInit<I, T>) => Promise<DecoderResponse<T>>;

export interface DecoderResponse<T> extends Response {
	decode(): Promise<T>;
}

export interface IotsRequestInit<I, T> extends RequestInit {
	decoder?: Decoder<I, T>
}

export interface IotsResponseInit<I, T> extends ResponseInit {
	decoder?: Decoder<I, T>
}
