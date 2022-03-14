import urlTemplate from 'url-template'
import { addQueryParameters } from './utils/add-query-parameters'
import { extractUrlVariableNames } from './utils/extract-url-variable-names'

type EndpointDefaults = import('./types').EndpointDefaults
type EndpointParams = import('./types').EndpointParams
type RequestMethod = import('./types').RequestMethod
type RequestOptions = import('./types').RequestOptions

const contentType = {
  formData: 'multipart/form-data',
  json: 'application/json; charset=utf-8'
}

export function parse(endpointOptions: EndpointDefaults): RequestOptions {
  const {
    method: _method,
    baseUrl,
    url: _url,
    headers,
    request,
    response,
    body: _body = {},
    ...params
  } = endpointOptions

  let body: any

  const method = _method.toUpperCase() as RequestMethod

  const urlVariableNames = extractUrlVariableNames(_url)

  let url = urlTemplate.parse(_url).expand(params)
  if (!/^http/.test(url)) {
    url = `${baseUrl}${url}`
  }

  const remainingParams = Object.keys(params).reduce(
    (bodyParams: EndpointParams, key): EndpointParams => {
      if (!urlVariableNames.includes(key)) bodyParams[key] = params[key]
      return bodyParams
    },
    {}
  )

  if (['GET', 'HEAD'].includes(method)) {
    url = addQueryParameters(url, remainingParams)
  } else {
    body = _body

    const bodyIsFormData = /form-?data/i.test(body.constructor.name)

    if (bodyIsFormData) {
      for (const paramName of Object.keys(remainingParams)) {
        body.append(paramName, remainingParams[paramName])
      }
    } else {
      body = JSON.stringify({ ...body, ...remainingParams })

      headers['content-type'] = contentType.json
    }
  }

  return {
    method,
    url,
    body,
    headers,
    request,
    response
  }
}
