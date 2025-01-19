# OpenAPI Editor

A web-based GUI editor for creating and modifying OpenAPI (Swagger) specifications in YAML format. This tool provides both a form-based interface and direct YAML editing capabilities.

## Features

- **Dual View Modes**
  - Form View: User-friendly interface for editing OpenAPI specifications
  - YAML View: Direct YAML editing with syntax highlighting
- **Real-time Preview**
  - Side-by-side JSON preview
  - Instant validation and error feedback
- **Component Editing**
  - API Information management
  - Server configuration
  - Schema definitions with property management
  - Path operations (GET, POST, PUT, DELETE, PATCH)
  - Request/Response configuration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/perryraskin/openapi-yaml-editor
cd openapi-editor
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

### Form View

1. Click the "Form View" button in the top navigation
2. Edit your OpenAPI specification using the intuitive form interface:
   - Modify API information (title, description, version)
   - Configure servers
   - Define schemas and properties
   - Create and edit API paths and operations

### YAML View

1. Click the "YAML View" button in the top navigation
2. Edit your OpenAPI specification directly in YAML format
3. See real-time JSON preview on the right

## Technology Stack

- React with TypeScript
- Vite
- Monaco Editor for YAML editing
- shadcn/ui components
- Tailwind CSS
- js-yaml for YAML parsing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
