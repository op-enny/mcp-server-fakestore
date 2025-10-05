# Fake Store API MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that provides seamless access to the [Fake Store API](https://fakestoreapi.com) for AI assistants. Perfect for e-commerce demos, testing, and learning MCP development.

## Features

- 🛍️ **Complete E-commerce Data Access**: Products, carts, and users
- 🔧 **18 MCP Tools**: Full CRUD operations for all resources
- 📦 **Easy Integration**: Works with Claude Desktop, Plugged.in, and other MCP clients
- 🚀 **Zero Configuration**: Works out of the box with Fake Store API
- 📝 **TypeScript**: Fully typed for better development experience
- ✅ **Input Validation**: Comprehensive parameter validation

## Installation

### NPX (Recommended)

```bash
npx -y mcp-server-fakestore
```

### From Source

```bash
git clone https://github.com/yourusername/mcp-server-fakestore.git
cd mcp-server-fakestore
npm install
npm run build
```

## Configuration

### Claude Desktop

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fakestore": {
      "command": "npx",
      "args": ["-y", "mcp-server-fakestore"]
    }
  }
}
```

### Plugged.in

Add this server configuration in Plugged.in MCP settings:

```json
{
  "name": "fakestore",
  "command": "npx",
  "args": ["-y", "mcp-server-fakestore"]
}
```

## Available Tools

### Products (7 tools)

- `fakestore_get_products` - Get all products with optional limit and sorting
- `fakestore_get_product` - Get a single product by ID
- `fakestore_get_categories` - Get all product categories
- `fakestore_get_products_by_category` - Get products in a specific category
- `fakestore_add_product` - Add a new product (simulation)
- `fakestore_update_product` - Update an existing product (simulation)
- `fakestore_delete_product` - Delete a product (simulation)

### Carts (6 tools)

- `fakestore_get_carts` - Get all carts with optional limit and sorting
- `fakestore_get_cart` - Get a single cart by ID
- `fakestore_get_user_carts` - Get all carts for a specific user
- `fakestore_add_cart` - Add a new cart (simulation)
- `fakestore_update_cart` - Update an existing cart (simulation)
- `fakestore_delete_cart` - Delete a cart (simulation)

### Users (5 tools)

- `fakestore_get_users` - Get all users with optional limit and sorting
- `fakestore_get_user` - Get a single user by ID
- `fakestore_add_user` - Add a new user (simulation)
- `fakestore_update_user` - Update an existing user (simulation)
- `fakestore_delete_user` - Delete a user (simulation)

## Usage Examples

### With Claude Desktop

**Get all products:**
```
Show me all products from the fake store
```

**Search by category:**
```
Show me electronics from the fake store
```

**Get user's cart:**
```
What's in user ID 1's shopping cart?
```

**Product analysis:**
```
Find the 5 most expensive products in the store
```

### Programmatic Usage

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// The server runs on stdio transport
// Connect your MCP client to interact with the tools
```

## Data Structure

### Product
```typescript
{
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
```

### Cart
```typescript
{
  id: number;
  userId: number;
  date: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}
```

### User
```typescript
{
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run watch

# Run tests
npm test
```

## Important Notes

- **Simulation**: The Fake Store API is read-only. POST, PUT, and DELETE operations return simulated responses but don't persist data.
- **Rate Limits**: The public API has no strict rate limits, but please be respectful.
- **Data**: All data is fake and for testing purposes only.

## Troubleshooting

### Server not appearing in Claude Desktop

1. Ensure the configuration file is valid JSON
2. Restart Claude Desktop completely
3. Check the Claude Desktop logs for errors

### Tools not working

1. Verify you have an active internet connection (API requires connectivity)
2. Check if fakestoreapi.com is accessible
3. Review error messages in Claude Desktop logs

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Resources

- [Fake Store API Documentation](https://fakestoreapi.com/docs)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Support

- 🐛 [Report Issues](https://github.com/yourusername/mcp-server-fakestore/issues)
- 💬 [Discussions](https://github.com/yourusername/mcp-server-fakestore/discussions)
- 📧 Email: your.email@example.com

---

Built with ❤️ for the MCP community
