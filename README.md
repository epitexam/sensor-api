# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Environment Setup

Copy the `.env.test` file and rename it to `.env` with the real variables. Make sure to provide valid environment variables.

## First Commands

Before starting development, run the following commands:

### `yarn install`

To install the dependencies.

### `yarn prisma db push`

To push the Prisma schema to the database.

### `yarn prisma seed`

To populate the database with fake data (see `prisma/seed.js` for details).

## Available Scripts

In the project directory, you can run:

### `yarn run dev`

Start the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn start`

Start the app in production mode.

### `yarn run test`

Run the test cases using Node.js's built-in test runner.

### `yarn prisma studio`

Launch Prisma Studio to visually inspect and manage your database.

## Plugins Used

### Prisma
- **Description**: ORM for database management.
- **Features**: Simplifies database queries, supports migrations, and provides a visual interface via Prisma Studio.

### JWT
- **Description**: Handles authentication using JSON Web Tokens.
- **Features**: Stateless authentication, token expiration, and role-based access control.

### Swagger
- **Description**: Generates interactive API documentation.
- **Access**: Visit `/documentation` in your browser to explore the API.

### Rate Limit
- **Description**: Limits the number of requests per minute to prevent abuse.
- **Default**: 150 requests per minute (configurable via the `RATE_LIMIT` environment variable).

## Testing

### Running Tests
Run the following command to execute all test cases:
```bash
yarn run test
```

### Test Files
Test files are located in the `test` directory and follow the structure of the application.

## Deployment

### PM2
The project includes a PM2 configuration file (`deployment/pm2.config.js`) for managing the application in production.

### Docker
A `docker-compose.yml` file is provided to set up a PostgreSQL database for the application.

## Learn More

To learn more about Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
To learn more about Prisma, visit the [Prisma documentation](https://www.prisma.io/docs/).

---

*Note: Some parts of this documentation and the codebase were generated with the assistance of GitHub Copilot.*