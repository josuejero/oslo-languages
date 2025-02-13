import { IncomingMessage, ServerResponse } from 'http';

interface CreateMocksResult<TReq = IncomingMessage, TRes = ServerResponse> {
  req: TReq;
  res: TRes;
}

/**
 * Creates mock request and response objects for testing.
 *
 * @param options - Optional configuration object.
 * @returns An object containing `req` and `res` mocks.
 */
export function createMocks<TReq = IncomingMessage, TRes = ServerResponse>(
  options?: object
): CreateMocksResult<TReq, TRes>;