# 🌐 **NestJS Boilerplate Documentation**

Welcome to the **NestJS Boilerplate** documentation. This guide will help you set up, run, and extend your NestJS application with essential modules and integrations.

---

## 🚧 **Setup**

Before you start, ensure that you have the following prerequisites:

- **Node.js**: Minimum version should be **18 & above**.
- **Docker CLI**, **Docker Compose**, and **Colima** (or an equivalent Docker engine - **Rancher Desktop** is one alternative to **Docker Desktop**) installed on your system.
- Start the Docker engine using:
  
  ```bash
  colima start
  ```

- Create a `.env` file in the root of your project. Copy the contents from `.env.example` and replace them with actual values to avoid runtime issues.
- We have integarted background workers using **Redis Queues**, If you wish not to use any background workers, The respective directory & it's dependencies can be removed directly. `/redis` directory is still needed for cacheing.

> 💡 **Note:** We have integrated **Prometheus**, **Grafana**, **Loki**, and **Promtail** for Application Performance Monitoring (APM) and centralized logging to help you monitor and visualize metrics in your NestJS application.

---

## 🚀 **Running the App**

Follow these steps to start your application:

```bash
# 1️⃣ Install dependencies
$ yarn install

# 2️⃣ Start Docker services
$ yarn db:dev:up

# 3️⃣ Run Migrations & Seeds
$ yarn prisma:setup

# 4️⃣ Start the NestJS app in development mode
$ yarn start:dev

# 5️⃣ Stop Docker services
$ yarn db:dev:rm
```

---

## 🧪 **Automatic Testing with Dredd**

Once your backend is fully running and Swagger is accessible, you can use **Dredd** to automate API testing against your OpenAPI specification. This ensures that your API endpoints behave as expected and conform to the documented contract.

### Running Dredd Tests

After the backend server is up and Swagger is accessible, simply run:

```bash
npm run test
```

This command will:

1. **Generate the OpenAPI Specification** by fetching the Swagger JSON from `http://localhost:${PORT}/api-json`.
2. **Execute Dredd Tests** using this OpenAPI spec to validate that the endpoints' responses match the expected definitions in the specification.

> **Note:** Ensure your server is fully running and accessible before starting the tests, as Dredd needs to interact with the live API.

### Viewing Test Results

- Test results are displayed directly in the terminal, showing which endpoints passed or failed.
- If an endpoint’s response doesn’t match the specification (e.g., due to headers, status codes, or body content differences), Dredd will mark it as failed and provide details on discrepancies.
- `apiary`'s temporary public reporting is also enabled to view the test results for 24 hours & share across team.

For more detailed reports, we can configure Dredd to save or display results in a specific format or integrate it with your CI pipeline.

---

## 📊 **Accessing Monitoring Tools**

Once the Docker services are up, you can access the following tools:

- 🔹 **Prometheus**: Available at `http://localhost:${PROMETHEUS_PORT}`. It collects and stores metrics exposed by the NestJS app.
- 🔹 **Grafana**: Available at `http://localhost:${GRAFANA_PORT}`. Visualize your app metrics by setting up Grafana dashboards.
  
  > **Login credentials for Grafana**:
  > - **Username**: `admin`
  > - **Password**: `{GRAFANA_ADMIN_PASSWORD}` (from your `.env` file)

### 🏡 **Setting up Prometheus and Loki in Grafana:**

1. Go to **Configuration** → **Data Sources**.
2. Click **Add Data Source**, select **Prometheus**, and set the URL to `http://prometheus:9090`. Save and test the connection.
3. Click **Add Data Source** again, select **Loki**, and set the URL to `http://loki:3100`. Save and test the connection.
4. To create a log panel in Grafana, navigate to **Create** → **Dashboard** → **Add New Panel**, and select **Loki** as the data source to query application logs.
5. Here's the sample [log dashboard](https://grafana.com/grafana/dashboards/13359-logs/) which can be used to copy template ID and import in Grafana.

---

## 📃 **Logs**

- Application logs are stored in the `/logs` directory.
- The logger captures details like **request paths**, **methods**, **status codes**, and **response times**.
- With **Promtail** and **Loki** integration, logs are shipped to **Grafana**, where you can view and analyze them effectively.

---

## 📈 **Monitoring Metrics**

Access application metrics via the `/metrics` endpoint of your running NestJS application. **Prometheus** collects these metrics, and **Grafana** visualizes them for you.

---

## ⚡ **Cache Interceptor**

The `ClientControlledCacheInterceptor` efficiently handles response caching based on `Cache-Control` headers provided by the client, using MD5 hashing to generate unique cache keys.

---

## 🐝 **Swagger Documentation**

Swagger provides auto-generated REST API documentation at `http://localhost:${PORT}/api`. This documentation is based on the decorators used in the application and will auto-update as your app evolves.

---

## 🔑 **Hashing with Bcrypt**

For secure password handling, the boilerplate integrates `bcrypt` for hashing:

- **hash(data)**: Hashes passwords before storing them in the database.
- **compare(data, encrypted)**: Validates the password by comparing hashed data.

---

## 🧩 **Adding New Modules**

You can find reusable modules in our 📦 **[CoE's Project Sample](https://git.geekyants.com/geekyants/coe-grp/project-sample/-/tree/main/Monolith/apps/backend?ref_type=heads)** repository. Follow the steps below to add new modules to your NestJS application:

### 🌟 **Step-by-Step Process to Add Modules**

1. **Identify Your Required Module** 🔍
   - For instance, if you want to add an **SMS** module, locate the `sms/` folder in the CoE's project sample repository under the `src/` directory.

2. **Copy the Module** 📂
   - Copy the entire `sms/` folder and place it into the `src/` directory of your NestJS project.

3. **Update Environment Variables** 🌐
   - Refer to the `.env.example` file in the sample repository for any required environment variables.
   - Example variables for SMS:

     ```bash
     # SMS Configuration
     TWILIO_ACCOUNT_SID=ACXXXXXXXXX
     TWILIO_AUTH_TOKEN=XXXXXXXXX
     TWILIO_SOURCE_NUMBER="+16518675309"
     ```

   - Add these to your `.env` file with actual values.

4. **Configure the Module** ⚙️
   - Add the environment variables to your `env.config.ts` file inside the `config/` module.
   - Register them in `env-config.module.ts` and validate them using Joi in the `validationSchema` object.

5. **Manage Dependencies** 🫡
   - If the module has dependencies (e.g., **DB**), copy the corresponding module from the project sample, keeping only relevant data.

6. **Database Configuration** 🛠️
   - Ensure the DB is set up correctly by adding the necessary DB image in your `docker-compose.yml` file, especially if there isn’t an existing connection URL.

Following these steps will integrate your new module seamlessly within your NestJS application! 🎉

---

## 📚 **Module Integration Guides**

Below are links to detailed guides for integrating common modules:

1. 🔑 **[Auth Module](https://coe.geekyants.com/docs/backend/Monolith/NestJs/Authentication#how-to-add-in-existing-application)**
2. 🔒 **[Authorization Module](https://coe.geekyants.comdocs/backend/Monolith/NestJs/Authorization#how-to-add-in-existing-application)**
3. 📤 **[Media Upload Module](https://coe.geekyants.com/docs/backend/Monolith/NestJs/FileStorage#how-to-add-in-existing-application)**
4. 🛠 **[Email Module](https://coe.geekyants.com/docs/backend/Monolith/NestJs/Email#how-to-add-in-existing-application)**
5. 📱 **[SMS Module](https://coe.geekyants.com/docs/backend/Monolith/NestJs/Sms#how-to-add-in-existing-application)**

These guides provide detailed steps on how to add the module, what dependencies are needed, and how to configure everything.
