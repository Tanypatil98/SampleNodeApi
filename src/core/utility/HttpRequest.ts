import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpRequest {
    public axios: AxiosInstance;
    constructor(baseURL?: string) {
        this.axios = axios.create({
            baseURL,
        });
        this.requsetInterceptor();
        this.reponseInterceptor();
    }

    reponseInterceptor() {
        // Add a response interceptor
        this.axios.interceptors.response.use(
            (response): AxiosResponse | Promise<AxiosResponse> => {
                // Do something with response data
                return response.data;
            },
            error => {
                // Do something with response error
                return Promise.reject(error);
            },
        );
    }

    requsetInterceptor() {
        this.axios.interceptors.request.use(
            (config): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
                // Do something before request is sent
                return config;
            },
            error => {
                // Do something with request error
                return Promise.reject(error);
            },
        );
    }

    fetch<T = any>(url: string, params: object, config: AxiosRequestConfig = {}): AxiosPromise<T> {
        return this.axios.get(url, {
            params,
            ...config,
        });
    }

    create<T = any>(url: string, data: object, config: AxiosRequestConfig = {}): AxiosPromise<T> {
        return this.axios.post(url, data, {
            ...config,
        });
    }

    update<T = any>(url: string, data: object, config: AxiosRequestConfig = {}): AxiosPromise<T> {
        return this.axios.put(url, data, {
            ...config,
        });
    }

}

export default HttpRequest;
