# E-Commerce API

Backend API for the E-Commerce application.

## Technology Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- `postgres` SQL client
- JWT authentication stored in an `accessToken` cookie
- Multer for product image uploads
- Stripe for payment integration
- S3-compatible storage for uploaded files

## Project Structure

```text
api/
├── migrations/
│   ├── 1_create_user_table.sql
│   ├── 2_create-category_table.sql
│   ├── 4_create_product_table.sql
│   ├── 5_create_product_sku_table.sql
│   ├── 6_create_order_table.sql
│   ├── 7_create_order_item_table.sql
│   ├── 8_create_cart_table.sql
│   ├── 9_create_cart_item_table.sql
│   ├── 10_create_addresses_table.sql
│   └── 11_create_payment_table.sql
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   │   └── index.ts
│   ├── common/
│   │   └── errors/
│   ├── config/
│   │   ├── db.ts
│   │   ├── env.ts
│   │   ├── redis.ts
│   │   └── s3.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── auth/
│   ├── modules/
│   │   ├── auth/
│   │   ├── addresses/
│   │   ├── carts/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── payment/
│   │   ├── products/
│   │   ├── user/
│   │   └── webhooks/
│   ├── services/
│   │   └── s3/
│   ├── shared/
│   │   ├── services/
│   │   └── types/
│   ├── utils/
│   ├── lib/
│   │   ├── email/
│   │   └── stripe/
│   └── emails/
│       └── templates/
├── package.json
├── tsconfig.json
├── docker-compose.yaml
└── run-migration.ts
```

Most modules use the following structure:

```text
module/
├── module.controller.ts
├── module.repository.ts
├── module.routes.ts
├── module.service.ts
└── module.types.ts
```

## API Base URL

All application routes are mounted under:

```text
/api
```

For local development, the base URL is usually:

```text
http://localhost:<PORT>/api
```

The port is configured through the environment settings used by the application.

## Authentication

Protected endpoints require a valid JWT access token in an HTTP cookie named:

```text
accessToken
```

The authentication middleware reads this cookie and assigns the decoded user to
`req.user`.

## API Endpoints

### Authentication

| Method | Endpoint | Authentication |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/verify` | Public |
| `POST` | `/api/auth/resend-verification-link` | Public |

### Categories

| Method | Endpoint | Authentication |
| --- | --- | --- |
| `POST` | `/api/categories` | Admin |
| `GET` | `/api/categories` | Public |
| `PUT` | `/api/categories/:id` | Admin |

### Products

| Method | Endpoint | Authentication | Content Type |
| --- | --- | --- | --- |
| `POST` | `/api/products` | Admin | `multipart/form-data` |
| `POST` | `/api/products/skus` | Admin | `multipart/form-data` |
| `POST` | `/api/products/product-attributes` | Admin | JSON |
| `GET` | `/api/products` | Public | JSON |
| `GET` | `/api/products/products-skus` | Public | JSON |
| `GET` | `/api/products/:productId` | Public | JSON |

For product and SKU creation, the upload fields are:

- `images`: up to 15 image files
- `cover`: one image file

### Carts

| Method | Endpoint | Authentication |
| --- | --- | --- |
| `POST` | `/api/carts` | Required |
| `GET` | `/api/carts` | Required |
| `POST` | `/api/carts/delete` | Required |

The cart item endpoints use the authenticated user's cart. The current routes
file contains two identical `POST /api/carts` registrations; both point to the
same controller action.

### Orders

| Method | Endpoint | Authentication |
| --- | --- | --- |
| `POST` | `/api/orders` | Required |
| `GET` | `/api/orders` | Required |
| `GET` | `/api/orders/:orderId` | Required |

Creating an order uses the authenticated user's cart and may return a payment
client secret when the payment intent is created successfully.

### Addresses

| Method | Endpoint | Authentication |
| --- | --- | --- |
| `POST` | `/api/addresses` | Required |
| `GET` | `/api/addresses` | Required |
| `GET` | `/api/addresses/:addressId` | Required |
| `PUT` | `/api/addresses/:addressId` | Required |
| `DELETE` | `/api/addresses/:addressId` | Required |

Address queries are scoped to the authenticated user. An address belonging to
another user cannot be read, updated, or deleted through these endpoints.

### Stripe Webhooks

| Method | Endpoint | Authentication |
| --- | --- | --- |
| `POST` | `/api/webhooks/stripe` | Stripe signature required |

Stripe sends the request signature in the `stripe-signature` header. The
endpoint verifies the raw request body using `STRIPE_WEBHOOK_SECRET` before
updating the related payment and order status.

## Address Fields

The address create and update payload supports:

```json
{
  "full_name": "John Doe",
  "phone": "+123456789",
  "city": "New York",
  "area": "Manhattan",
  "street": "Main Street",
  "building": "12",
  "apartment": "4B",
  "notes": "Leave the package at the reception"
}
```

Required fields:

- `full_name`
- `phone`
- `city`
- `street`

Optional fields:

- `area`
- `building`
- `apartment`
- `notes`

## Roles

New users receive the `user` role. Catalog creation and updates require the
`admin` role. Apply migrations before starting the API, then promote an
administrator explicitly in PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

The role is loaded from the database for every protected catalog operation;
roles are not trusted from the client or from stale access-token claims.

## Database Tables

The migrations create the following main tables:

```text
users
categories
products
products_skus
orders
order_items
carts
cart_items
addresses
payments
```

The `addresses` table is created by:

```text
migrations/10_create_addresses_table.sql
```

## Installation and Running

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npm run db:migrate
```

Copy `.env.example` to `.env` and provide local credentials before starting the
API. Never commit `.env`; secrets must be supplied through environment
variables.

## Docker Compose

The Compose stack runs the API, PostgreSQL, Redis, and RabbitMQ together.
Copy `.env.example` to `.env`, replace the placeholder secrets, then run:

```bash
docker compose up --build
```

The API is available at `http://localhost:8090`, and the RabbitMQ management
console is available at `http://localhost:15672`.

The API container waits for PostgreSQL, Redis, and RabbitMQ health checks,
applies migrations, and then starts the compiled server. Within the Compose
network, the services are addressed as `postgres`, `redis`, and `rabbitmq`;
the host-facing ports are only for local development.

Start the development server:

```bash
npm run dev
```

Build the TypeScript project:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

## Environment Configuration

Create an environment file for the API and provide the database, JWT, storage,
email, and payment configuration required by the application.

The JWT configuration must include separate `JWT_ACCESS_SECRET` and
`JWT_REFRESH_SECRET` values. Stripe webhook handling also requires
`STRIPE_WEBHOOK_SECRET`.

Set `FRONTEND_URL` to the allowed frontend origin. The API enables CORS with
credentials for this origin so the authentication cookies can be sent by the
frontend.

Database configuration is read by [src/config/db.ts](./src/config/db.ts).

Do not commit secrets, access tokens, or production credentials to the
repository.
