import { axiosInstance, generateSort, generateFilter } from "./utils";
import { stringify } from "query-string";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { DataProvider, BaseRecord } from "@refinedev/core";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";
const TOKEN_KEY = "bfarmx-expert-auth";

interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

const handleApiResponse = <T extends BaseRecord>(
  response: AxiosResponse<ApiResponse<T>>,
  isArray: boolean = false
): ApiResponse<T | T[]> => {
  const responseData = response.data;

  if (responseData?.status && responseData.status !== 200) {
    throw new Error(responseData.message || "API request failed");
  }

  const data =
    responseData?.data !== undefined ? responseData.data : responseData;

  return {
    status: responseData?.status || 200,
    message: responseData?.message || "",
    data: isArray ? (Array.isArray(data) ? data : []) : (data as T),
  };
};

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      _start?: number;
      _end?: number;
      _sort?: string;
      _order?: string;
    } = {};

    if (mode === "server") {
      query._start = (current - 1) * pageSize;
      query._end = current * pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const combinedQuery = { ...query, ...queryFilters };
    const urlWithQuery = Object.keys(combinedQuery).length
      ? `${url}?${stringify(combinedQuery)}`
      : url;

    const response = await httpClient[requestMethod](urlWithQuery, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        ...headersFromMeta,
      },
    });

    const { data } = handleApiResponse(response, true);

    const total = response.headers["x-total-count"]
      ? parseInt(response.headers["x-total-count"], 10)
      : Array.isArray(data)
        ? data.length
        : 0;

    return {
      data: data as any[],
      total,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const response = await httpClient[requestMethod](
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          ...headers,
        },
      }
    );

    const { data } = handleApiResponse(response, true);

    return {
      data: data as any[],
    };
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const response = await httpClient[requestMethod](url, variables, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        ...headers,
      },
    });

    const { data } = handleApiResponse(response);

    return {
      data: data as any,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "put";

    const response = await httpClient[requestMethod](url, variables, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        ...headers,
      },
    });

    const { data } = handleApiResponse(response);

    return {
      data: data as any,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const response = await httpClient[requestMethod](url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        ...headers,
      },
    });

    const { data } = handleApiResponse(response);

    return {
      data: data as any,
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const response = await httpClient[requestMethod](url, {
      data: variables,

      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        ...headers,
      },
    });

    const { data } = handleApiResponse(response);

    return {
      data: data as any,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "patch":
      case "post":
      case "put":
        axiosResponse = await httpClient[method](url, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            ...headers,
          },
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,

          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            ...headers,
          },
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            ...headers,
          },
        });
        break;
    }

    const { data } = handleApiResponse(axiosResponse);

    return Promise.resolve({ data: data as any });
  },
});
