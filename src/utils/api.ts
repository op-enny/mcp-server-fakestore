/**
 * API utility functions for Fake Store API
 */

import axios, { AxiosError } from 'axios';
import { ApiError } from '../types/fakestore.js';

const BASE_URL = 'https://fakestoreapi.com';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.message || 'API request failed',
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Unknown error occurred',
  };
}

/**
 * GET request wrapper
 */
export async function get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * POST request wrapper
 */
export async function post<T>(endpoint: string, data?: unknown): Promise<T> {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * PUT request wrapper
 */
export async function put<T>(endpoint: string, data?: unknown): Promise<T> {
  try {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * DELETE request wrapper
 */
export async function del<T>(endpoint: string): Promise<T> {
  try {
    const response = await api.delete<T>(endpoint);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
