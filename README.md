# NestJS Boilerplate

## Setup

- Minimum Node version should be **18 & above**.
- Install `docker` CLI, `docker-compose`, and `colima` docker engine via Homebrew.
- Start the Docker engine by running `colima start`.
- Add a `.env` file and copy the content from `.env.example` file, then add the actual values for all fields to avoid issues at runtime.
- We have integrated **Prometheus** and **Grafana** to provide monitoring and visualization for metrics (APM). These tools help monitor the performance and activity of your NestJS application.

## Key Features

### 1. **Logging**

- The application uses a custom `LoggerService` that captures detailed logs for different operations. Logs are stored in a file for later analysis and debugging.
- You can find the logs in the `logs` directory of the application.

### 2. **Metrics Monitoring**

- The boilerplate integrates **Prometheus** for collecting application metrics and **Grafana** for visualization.
- The `/metrics` endpoint exposes all the metrics in the **Prometheus** format, which helps monitor application performance in real-time.

#### Key Metrics Exposed

- Total number of HTTP requests
- Request duration
- Active users
- CPU and memory usage
- Req. Method, Res. Status, ROUTE/Path (For better filteration) etc.

### 3. **Cache Management**

- A custom `ClientControlledCacheInterceptor` is implemented to cache responses, optimizing performance for repeated requests.
- This interceptor can manage caching logic based on HTTP `Cache-Control` headers.
- Caching is handled using NestJS's built-in `CacheModule`, with support for various storage backends like Redis, in-memory, etc.

### 4. **Swagger Documentation**

- The boilerplate uses `SwaggerModule` to generate REST API documentation automatically.
- You can access the Swagger UI at `/api` after running the application. It provides detailed API information, including request and response structures.

### 5. **GraphQL Integration**

- The application comes with a fully integrated **Apollo GraphQL** server. The GraphQL schema is auto-generated, making it easier to manage queries and mutations.
- Access the GraphQL playground at `/graphql` to explore the schema, run queries, and test mutations.

### 6. **Hashing Technique**

- The boilerplate uses **bcrypt** for hashing passwords, ensuring secure storage. The `HashingService` provides methods for hashing and comparing data, which is useful for handling sensitive information like passwords.

### 7. **Environment Variable Validation**

- The `EnvConfigModule` validates all required environment variables using the `joi` library to ensure that your application starts with all the necessary configurations.

---

## Running the app

```bash
# Install dependencies
$ npm install

# Start the Docker services (Prometheus, and Grafana)
$ docker compose up -d

# Start the app in development mode
$ npm run start:dev
```

### Accessing the Tools

Once the Docker services are up, you can access the following:

- **Prometheus**: Available at `http://localhost:${PROMETHEUS_PORT}`. Prometheus collects and stores the metrics exposed by our NestJS app.
- **Grafana**: Available at `http://localhost:${GRAFANA_PORT}`. You can visualize your app metrics by setting up Grafana dashboards.
  - Login credentials for Grafana: `admin` / `{GRAFANA_ADMIN_PASSWORD}` (Password set via environment variables).
  - After login, add Prometheus as a data source in Grafana:
    1. Go to **Configuration** → **Data Sources**.
    2. Click **Add Data Source**, select **Prometheus**, and enter `http://prometheus:9090` as the URL.
    3. Save and test the data source.
  - Create a dashboard by taking references from [Grafana Dashboards](https://grafana.com/grafana/dashboards/).

### Logs

- All application logs are stored in the `/logs` directory.
- The logger captures information such as request paths, methods, status codes, and response times.

### Monitoring Metrics

You can fetch the metrics by visiting `/metrics` on your running NestJS application. These metrics are collected by Prometheus and displayed in Grafana for visualization.

### Cache Interceptor

The `ClientControlledCacheInterceptor` handles response caching based on client-provided `Cache-Control` headers. It uses an MD5 hash to generate cache keys, ensuring efficient caching without conflicts.

### Swagger Documentation

Swagger provides auto-generated REST API documentation at `http://localhost:${PORT}/api`. This documentation is generated based on decorators used in the application and is updated as the application evolves.

### GraphQL Integration

The GraphQL endpoint `/graphql` provides a playground interface to interact with the GraphQL schema. The schema is automatically generated based on your resolvers and entities using Apollo Server.

### Hashing with Bcrypt

The boilerplate integrates `bcrypt` for secure password hashing:

- **hash(data)**: Hashes data (usually passwords) before storing them in the database.
- **compare(data, encrypted)**: Compares hashed data with a plain string to validate matches.

---

## Managing Docker Containers Using Docker CLI

To interact with Docker containers via the CLI, use the following commands:

```bash
# Start the Docker services (Postgres, Prometheus, and Grafana)
$ docker-compose up -d

# Stop and remove all Docker containers
$ docker-compose down

# Rebuild Docker containers if there are changes
$ docker-compose up --build

# View logs for all services
$ docker-compose logs -f

# Check running containers
$ docker ps -a
```

## Test

```bash
# Run unit tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Check test coverage
$ npm run test:cov
```
