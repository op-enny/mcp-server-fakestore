/**
 * Product-related MCP tools
 */

import { get, post, put, del } from '../utils/api.js';
import { Product, SortOrder } from '../types/fakestore.js';
import { validatePositiveInteger, validateSortOrder, validateLimit, validateUrl, sanitizePathSegment } from '../utils/validators.js';

/**
 * Get all products with optional limit and sort
 */
export async function getAllProducts(args: { limit?: number; sort?: SortOrder }): Promise<Product[]> {
  const { limit, sort } = args;

  if (limit !== undefined) {
    validateLimit(limit);
  }
  if (sort !== undefined) {
    validateSortOrder(sort);
  }

  const params: Record<string, unknown> = {};
  if (limit) params.limit = limit;
  if (sort) params.sort = sort;

  return get<Product[]>('/products', params);
}

/**
 * Get a single product by ID
 */
export async function getProductById(args: { id: number }): Promise<Product> {
  const { id } = args;
  validatePositiveInteger(id, 'Product ID');
  return get<Product>(`/products/${id}`);
}

/**
 * Get all product categories
 */
export async function getCategories(): Promise<string[]> {
  return get<string[]>('/products/categories');
}

/**
 * Get products by category
 */
export async function getProductsByCategory(args: { category: string }): Promise<Product[]> {
  const { category } = args;
  if (!category || typeof category !== 'string') {
    throw new Error('Category must be a non-empty string');
  }
  const sanitizedCategory = sanitizePathSegment(category);
  return get<Product[]>(`/products/category/${sanitizedCategory}`);
}

/**
 * Add a new product (simulation - returns the product with an ID)
 */
export async function addProduct(args: {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}): Promise<Product> {
  const { title, price, description, image, category } = args;

  if (!title || typeof title !== 'string') {
    throw new Error('Title must be a non-empty string');
  }
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('Price must be a positive number');
  }
  if (!description || typeof description !== 'string') {
    throw new Error('Description must be a non-empty string');
  }
  validateUrl(image, 'Image URL');
  if (!category || typeof category !== 'string') {
    throw new Error('Category must be a non-empty string');
  }

  return post<Product>('/products', {
    title,
    price,
    description,
    image,
    category,
  });
}

/**
 * Update a product (simulation)
 */
export async function updateProduct(args: {
  id: number;
  title?: string;
  price?: number;
  description?: string;
  image?: string;
  category?: string;
}): Promise<Product> {
  const { id, title, price, description, image, category } = args;
  validatePositiveInteger(id, 'Product ID');

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (price !== undefined) updateData.price = price;
  if (description !== undefined) updateData.description = description;
  if (image !== undefined) {
    validateUrl(image, 'Image URL');
    updateData.image = image;
  }
  if (category !== undefined) updateData.category = category;

  return put<Product>(`/products/${id}`, updateData);
}

/**
 * Delete a product (simulation)
 */
export async function deleteProduct(args: { id: number }): Promise<Product> {
  const { id } = args;
  validatePositiveInteger(id, 'Product ID');
  return del<Product>(`/products/${id}`);
}

/**
 * Product tools definitions for MCP
 */
export const productTools = [
  {
    name: 'fakestore_get_products',
    description: 'Get all products from the store. Optionally limit results and sort by price.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Limit the number of products returned',
        },
        sort: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort products by price (asc or desc)',
        },
      },
    },
  },
  {
    name: 'fakestore_get_product',
    description: 'Get a single product by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Product ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'fakestore_get_categories',
    description: 'Get all available product categories',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'fakestore_get_products_by_category',
    description: 'Get all products in a specific category',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Product category name',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'fakestore_add_product',
    description: 'Add a new product to the store (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Product title',
        },
        price: {
          type: 'number',
          description: 'Product price',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        image: {
          type: 'string',
          description: 'Product image URL',
        },
        category: {
          type: 'string',
          description: 'Product category',
        },
      },
      required: ['title', 'price', 'description', 'image', 'category'],
    },
  },
  {
    name: 'fakestore_update_product',
    description: 'Update an existing product (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Product ID to update',
        },
        title: {
          type: 'string',
          description: 'New product title',
        },
        price: {
          type: 'number',
          description: 'New product price',
        },
        description: {
          type: 'string',
          description: 'New product description',
        },
        image: {
          type: 'string',
          description: 'New product image URL',
        },
        category: {
          type: 'string',
          description: 'New product category',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'fakestore_delete_product',
    description: 'Delete a product (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Product ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
