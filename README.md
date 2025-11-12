# NestJS Product API

A RESTful API built with NestJS, TypeORM, and SQLite for managing products.

## Features

- Create products with validation
- List all products
- Automatic title normalization (converts to uppercase)
- Input validation using class-validator

## Prerequisites

- Node.js (latest LTS version recommended)
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run start:dev
```

The application will start on `http://localhost:3000`

## API Endpoints

### Create Product

**POST** `/products`

Creates a new product. The title will be automatically normalized to uppercase.

### Get All Products

**GET** `/products`

Returns a list of all products.

## Testing with cURL

### 1. Create a Product (Success)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/product.jpg",
    "title": "Amazing Product",
    "description": "This is an amazing product description",
    "price": 29.99
  }'
```

**Expected Response (200):**

```json
{
  "id": 1,
  "imageUrl": "https://example.com/product.jpg",
  "title": "AMAZING PRODUCT",
  "description": "This is an amazing product description",
  "price": 29.99
}
```

Note: The title is automatically converted to uppercase.

### 2. Create Product with Validation Error (400)

This example demonstrates validation failure by providing an invalid URL:

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "not-a-valid-url",
    "title": "Test Product",
    "description": "Test description",
    "price": 19.99
  }'
```

**Expected Response (400):**

```json
{
  "statusCode": 400,
  "message": ["imageUrl must be a URL"],
  "error": "Bad Request"
}
```

Other validation errors you can test:

**Invalid price (must be >= 0.01):**

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/product.jpg",
    "title": "Test Product",
    "description": "Test description",
    "price": 0
  }'
```

**Missing required fields:**

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/product.jpg",
    "price": 19.99
  }'
```

### 3. Get All Products

```bash
curl http://localhost:3000/products
```

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "imageUrl": "https://example.com/product.jpg",
    "title": "AMAZING PRODUCT",
    "description": "This is an amazing product description",
    "price": 29.99
  }
]
```

## Database

The application uses SQLite with a database file `database.sqlite` created automatically in the project root. The database schema is synchronized automatically in development mode.
