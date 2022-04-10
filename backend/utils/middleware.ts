import type { Request, Response } from 'express'

// This middleware is to handle all disallowed methods and non-implemented endpoints.
export function endpointHandler (request: Request, response: Response) {
  (request.url === '/farms' ||
    request.url === '/data') &&
  (request.method === 'PUT' ||
    request.method === 'DELETE')
    ? response.status(405).header({Allow: 'GET, POST'}).end()
    : response.status(404).end()
}

// This is for enhanced error-handling (used mostly when inserting).
export function errorHandler(err: { code: string; sqlMessage: any }, _: Request, response: Response) {
    return (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_NO_DEFAULT_FOR_FIELD')
      ? response.status(400).json({ error: err.sqlMessage })
      : response.status(500).json(err)
}
