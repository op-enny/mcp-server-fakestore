#!/usr/bin/env node

/**
 * Fake Store API MCP Server
 *
 * A Model Context Protocol server that provides access to the Fake Store API
 * for e-commerce data integration with AI assistants.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { productTools, getAllProducts, getProductById, getCategories, getProductsByCategory, addProduct, updateProduct, deleteProduct } from './tools/products.js';
import { cartTools, getAllCarts, getCartById, getUserCarts, addCart, updateCart, deleteCart } from './tools/carts.js';
import { userTools, getAllUsers, getUserById, addUser, updateUser, deleteUser } from './tools/users.js';

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'fakestore-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [...productTools, ...cartTools, ...userTools],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Product tools
    if (name === 'fakestore_get_products') {
      const result = await getAllProducts(args as { limit?: number; sort?: 'asc' | 'desc' });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_get_product') {
      const result = await getProductById(args as { id: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_get_categories') {
      const result = await getCategories();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_get_products_by_category') {
      const result = await getProductsByCategory(args as { category: string });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_add_product') {
      const result = await addProduct(args as {
        title: string;
        price: number;
        description: string;
        image: string;
        category: string;
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_update_product') {
      const result = await updateProduct(args as {
        id: number;
        title?: string;
        price?: number;
        description?: string;
        image?: string;
        category?: string;
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_delete_product') {
      const result = await deleteProduct(args as { id: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // Cart tools
    if (name === 'fakestore_get_carts') {
      const result = await getAllCarts(args as { limit?: number; sort?: 'asc' | 'desc' });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_get_cart') {
      const result = await getCartById(args as { id: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_get_user_carts') {
      const result = await getUserCarts(args as { userId: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_add_cart') {
      const result = await addCart(args as {
        userId: number;
        date: string;
        products: Array<{ productId: number; quantity: number }>;
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_update_cart') {
      const result = await updateCart(args as {
        id: number;
        userId?: number;
        date?: string;
        products?: Array<{ productId: number; quantity: number }>;
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_delete_cart') {
      const result = await deleteCart(args as { id: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // User tools
    if (name === 'fakestore_get_users') {
      const result = await getAllUsers(args as { limit?: number; sort?: 'asc' | 'desc' });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_get_user') {
      const result = await getUserById(args as { id: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_add_user') {
      const result = await addUser(args as {
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
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_update_user') {
      const result = await updateUser(args as {
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
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === 'fakestore_delete_user') {
      const result = await deleteUser(args as { id: number });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr since stdout is used for MCP communication
  console.error('Fake Store MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
