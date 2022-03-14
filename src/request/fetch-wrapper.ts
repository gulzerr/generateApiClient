import isPlainObject from 'is-plain-object'
import nodeFetch from 'node-fetch'
import { HTTPError } from '../error'
import { getResponseBody } from './utils/get-response-body'

type Endpoint = import('./types').Endpoint
type Response<T> = import('./types').Response<T>

export async function fetchWrapper(
  requestOptions: ReturnType<Endpoint>
): Promise<Response<any>> {
  const { method, url, headers, body, request } = requestOptions

  const options = Object.assign({ method, body, headers }, request)

  const fetch = request!.fetch || nodeFetch

  const extractBody =
    (requestOptions.response && requestOptions.response.body) || getResponseBody

  const ResponseHeaders: Response<any>['headers'] = {}

  try {
    const response = await fetch(url, options)

    const ResponseMeta = {
      status: response.status,
      url: response.url
    }

    for (const [field, value] of response.headers) {
      ResponseHeaders[field] = value
    }

    const body: any = await extractBody(response)

    const contentIsJSON = isPlainObject(body)

    if (response.status >= 400) {
      throw new HTTPError(response.statusText, response.status, {
        error: contentIsJSON ? body.error : body,
        headers: ResponseHeaders,
        request: requestOptions
      })
    }

    return {
      data: contentIsJSON ? body.data : body,
      headers: ResponseHeaders,
      params: Object.assign({}, contentIsJSON ? body.params : {}),
      meta: Object.assign({}, contentIsJSON ? body.meta : {}, ResponseMeta)
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      throw error
    }

    throw new HTTPError(error.message, 500, {
      error: error,
      headers: ResponseHeaders,
      request: requestOptions
    })
  }
}
