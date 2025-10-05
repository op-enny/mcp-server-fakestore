/**
 * User-related MCP tools
 */

import { get, post, put, del } from '../utils/api.js';
import { User, SortOrder } from '../types/fakestore.js';
import { validatePositiveInteger, validateSortOrder, validateLimit } from '../utils/validators.js';

/**
 * Get all users with optional limit and sort
 */
export async function getAllUsers(args: { limit?: number; sort?: SortOrder }): Promise<User[]> {
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

  return get<User[]>('/users', params);
}

/**
 * Get a single user by ID
 */
export async function getUserById(args: { id: number }): Promise<User> {
  const { id } = args;
  validatePositiveInteger(id, 'User ID');
  return get<User>(`/users/${id}`);
}

/**
 * Add a new user (simulation)
 */
export async function addUser(args: {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  city: string;
  street: string;
  number: number;
  zipcode: string;
  lat: string;
  long: string;
  phone: string;
}): Promise<User> {
  const {
    email,
    username,
    password,
    firstname,
    lastname,
    city,
    street,
    number,
    zipcode,
    lat,
    long,
    phone,
  } = args;

  // Basic validation
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a non-empty string');
  }
  if (!username || typeof username !== 'string') {
    throw new Error('Username must be a non-empty string');
  }
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  if (!firstname || typeof firstname !== 'string') {
    throw new Error('First name must be a non-empty string');
  }
  if (!lastname || typeof lastname !== 'string') {
    throw new Error('Last name must be a non-empty string');
  }

  return post<User>('/users', {
    email,
    username,
    password,
    name: {
      firstname,
      lastname,
    },
    address: {
      city,
      street,
      number,
      zipcode,
      geolocation: {
        lat,
        long,
      },
    },
    phone,
  });
}

/**
 * Update a user (simulation)
 */
export async function updateUser(args: {
  id: number;
  email?: string;
  username?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  city?: string;
  street?: string;
  number?: number;
  zipcode?: string;
  lat?: string;
  long?: string;
  phone?: string;
}): Promise<User> {
  const {
    id,
    email,
    username,
    password,
    firstname,
    lastname,
    city,
    street,
    number,
    zipcode,
    lat,
    long,
    phone,
  } = args;

  validatePositiveInteger(id, 'User ID');

  const updateData: Record<string, unknown> = {};
  if (email !== undefined) updateData.email = email;
  if (username !== undefined) updateData.username = username;
  if (password !== undefined) updateData.password = password;
  if (phone !== undefined) updateData.phone = phone;

  // Handle name updates
  if (firstname !== undefined || lastname !== undefined) {
    updateData.name = {};
    if (firstname !== undefined) (updateData.name as Record<string, unknown>).firstname = firstname;
    if (lastname !== undefined) (updateData.name as Record<string, unknown>).lastname = lastname;
  }

  // Handle address updates
  if (city !== undefined || street !== undefined || number !== undefined || zipcode !== undefined || lat !== undefined || long !== undefined) {
    updateData.address = {};
    if (city !== undefined) (updateData.address as Record<string, unknown>).city = city;
    if (street !== undefined) (updateData.address as Record<string, unknown>).street = street;
    if (number !== undefined) (updateData.address as Record<string, unknown>).number = number;
    if (zipcode !== undefined) (updateData.address as Record<string, unknown>).zipcode = zipcode;

    if (lat !== undefined || long !== undefined) {
      (updateData.address as Record<string, unknown>).geolocation = {};
      if (lat !== undefined) ((updateData.address as Record<string, unknown>).geolocation as Record<string, unknown>).lat = lat;
      if (long !== undefined) ((updateData.address as Record<string, unknown>).geolocation as Record<string, unknown>).long = long;
    }
  }

  return put<User>(`/users/${id}`, updateData);
}

/**
 * Delete a user (simulation)
 */
export async function deleteUser(args: { id: number }): Promise<User> {
  const { id } = args;
  validatePositiveInteger(id, 'User ID');
  return del<User>(`/users/${id}`);
}

/**
 * User tools definitions for MCP
 */
export const userTools = [
  {
    name: 'fakestore_get_users',
    description: 'Get all users from the store. Optionally limit results and sort.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Limit the number of users returned',
        },
        sort: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort users (asc or desc)',
        },
      },
    },
  },
  {
    name: 'fakestore_get_user',
    description: 'Get a single user by their ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'User ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'fakestore_add_user',
    description: 'Add a new user (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'User email address',
        },
        username: {
          type: 'string',
          description: 'Username',
        },
        password: {
          type: 'string',
          description: 'User password',
        },
        firstname: {
          type: 'string',
          description: 'First name',
        },
        lastname: {
          type: 'string',
          description: 'Last name',
        },
        city: {
          type: 'string',
          description: 'City',
        },
        street: {
          type: 'string',
          description: 'Street name',
        },
        number: {
          type: 'number',
          description: 'Street number',
        },
        zipcode: {
          type: 'string',
          description: 'ZIP code',
        },
        lat: {
          type: 'string',
          description: 'Latitude',
        },
        long: {
          type: 'string',
          description: 'Longitude',
        },
        phone: {
          type: 'string',
          description: 'Phone number',
        },
      },
      required: ['email', 'username', 'password', 'firstname', 'lastname', 'city', 'street', 'number', 'zipcode', 'lat', 'long', 'phone'],
    },
  },
  {
    name: 'fakestore_update_user',
    description: 'Update an existing user (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'User ID to update',
        },
        email: {
          type: 'string',
          description: 'New email address',
        },
        username: {
          type: 'string',
          description: 'New username',
        },
        password: {
          type: 'string',
          description: 'New password',
        },
        firstname: {
          type: 'string',
          description: 'New first name',
        },
        lastname: {
          type: 'string',
          description: 'New last name',
        },
        city: {
          type: 'string',
          description: 'New city',
        },
        street: {
          type: 'string',
          description: 'New street name',
        },
        number: {
          type: 'number',
          description: 'New street number',
        },
        zipcode: {
          type: 'string',
          description: 'New ZIP code',
        },
        lat: {
          type: 'string',
          description: 'New latitude',
        },
        long: {
          type: 'string',
          description: 'New longitude',
        },
        phone: {
          type: 'string',
          description: 'New phone number',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'fakestore_delete_user',
    description: 'Delete a user (simulation - does not persist)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'User ID to delete',
        },
      },
      required: ['id'],
    },
  },
];
