/**
 * Cart-related MCP tools
 */

import { get, post, put, del } from '../utils/api.js';
import { Cart, CartProduct, SortOrder } from '../types/fakestore.js';
import { validatePositiveInteger, validateSortOrder, validateLimit } from '../utils/validators.js';

/**
 * Get all carts with optional limit and sort
 */
export async function getAllCarts(args: { limit?: number; sort?: SortOrder }): Promise<Cart[]> {
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

  return get<Cart[]>('/carts', params);
}

/**
 * Get a single cart by ID
 */
export async function getCartById(args: { id: number }): Promise<Cart> {
  const { id } = args;
  validatePositiveInteger(id, 'Cart ID');
  return get<Cart>(`/carts/${id}`);
}

/**
 * Get carts by user ID
 */
export async function getUserCarts(args: { userId: number }): Promise<Cart[]> {
  const { userId } = args;
  validatePositiveInteger(userId, 'User ID');
  return get<Cart[]>(`/carts/user/${userId}`);
}

/**
 * Add a new cart (simulation)
 */
export async function addCart(args: {
  userId: number;
  date: string;
  products: CartProduct[];
}): Promise<Cart> {
  const { userId, date, products } = args;

  validatePositiveInteger(userId, 'User ID');

  if (!date || typeof date !== 'string') {
    throw new Error('Date must be a non-empty string');
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Products must be a non-empty array');
  }

  // Validate each product in the cart
  products.forEach((product, index) => {
    if (typeof product.productId !== 'number' || product.productId <= 0) {
      throw new Error(`Product ${index + 1}: productId must be a positive number`);
    }
    if (typeof product.quantity !== 'number' || product.quantity <= 0) {
      throw new Error(`Product ${index + 1}: quantity must be a positive number`);
    }
  });

  return post<Cart>('/carts', {
    userId,
    date,
    products,
  });
}

/**
 * Update a cart (simulation)
 */
export async function updateCart(args: {
  id: number;
  userId?: number;
  date?: string;
  products?: CartProduct[];
}): Promise<Cart> {
  const { id, userId, date, products } = args;
  validatePositiveInteger(id, 'Cart ID');

  const updateData: Record<string, unknown> = {};
  if (userId !== undefined) {
    validatePositiveInteger(userId, 'User ID');
    updateData.userId = userId;
  }
  if (date !== undefined) updateData.date = date;
  if (products !== undefined) {
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Products must be a non-empty array');
    }
    updateData.products = products;
  }

  return put<Cart>(`/carts/${id}`, updateData);
}

/**
 * Delete a cart (simulation)
 */
export async function deleteCart(args: { id: number }): Promise<Cart> {
  const { id } = args;
  validatePositiveInteger(id, 'Cart ID');
  return del<Cart>(`/carts/${id}`);
}

/**
 * Cart tools definitions for MCP
 */
export const cartTools = [
  {
    name: 'fakestore_get_carts',
    description: 'Get all carts from the store. Optionally limit results and sort.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Limit the number of carts returned',
        },
        sort: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort carts (asc or desc)',
        },
      },
    },
  },
  {
    name: 'fakestore_get_cart',
    description: 'Get a single cart by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Cart ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'fakestore_get_user_carts',
    description: 'Get all carts belonging to a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          description: 'User ID',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: 'fakestore_add_cart',
    description: 'Add a new cart (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          description: 'User ID who owns the cart',
        },
        date: {
          type: 'string',
          description: 'Cart date in ISO format (e.g., 2024-01-01)',
        },
        products: {
          type: 'array',
          description: 'Array of products in the cart',
          items: {
            type: 'object',
            properties: {
              productId: {
                type: 'number',
                description: 'Product ID',
              },
              quantity: {
                type: 'number',
                description: 'Product quantity',
              },
            },
            required: ['productId', 'quantity'],
          },
        },
      },
      required: ['userId', 'date', 'products'],
    },
  },
  {
    name: 'fakestore_update_cart',
    description: 'Update an existing cart (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Cart ID to update',
        },
        userId: {
          type: 'number',
          description: 'New user ID',
        },
        date: {
          type: 'string',
          description: 'New cart date',
        },
        products: {
          type: 'array',
          description: 'New products array',
          items: {
            type: 'object',
            properties: {
              productId: {
                type: 'number',
                description: 'Product ID',
              },
              quantity: {
                type: 'number',
                description: 'Product quantity',
              },
            },
            required: ['productId', 'quantity'],
          },
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'fakestore_delete_cart',
    description: 'Delete a cart (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Cart ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
