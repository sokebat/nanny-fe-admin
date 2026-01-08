import type { AxiosRequestConfig } from "axios";
import { axiosPrivate, axiosPublic } from "@/services/axios";
export class ApiService {
  protected getClient(usePrivate: boolean) {
    return usePrivate ? axiosPrivate : axiosPublic;
  }

  protected async get<T>(
    endpoint: string,
    usePrivate = false,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const client = this.getClient(usePrivate);
      const response = await client.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.extractError(error);
    }
  }

  protected async post<T>(
    endpoint: string,
    data: unknown,
    usePrivate = false,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const client = this.getClient(usePrivate);
      const response = await client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.extractError(error);
    }
  }

  protected async put<T>(
    endpoint: string,
    data: unknown,
    usePrivate = false,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const client = this.getClient(usePrivate);
      const response = await client.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.extractError(error);
    }
  }

  protected async patch<T>(
    endpoint: string,
    data: unknown,
    usePrivate = false,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const client = this.getClient(usePrivate);
      const response = await client.patch<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.extractError(error);
    }
  }

  protected async delete<T>(
    endpoint: string,
    usePrivate = false,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const client = this.getClient(usePrivate);
      const response = await client.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.extractError(error);
    }
  }

  private extractError(error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    return new Error(
      axiosError?.response?.data?.message || axiosError?.message || "An unexpected error occurred."
    );
  }
}
