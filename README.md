# Notes

## Future Improvements

Due to time constraints, the following enhancements have not been implemented but are recommended for future development:

- Dynamic Cron Schedule: add an interface or configuration file to allow dynamic updates to the schedule without modifying the codebase.
- Tracking run job: create mesasge_logs table and save run jobs, for case redis is down. It will be easy when we want to restart job without duplicate problem

  ```code
  WHERE mesasge_logs.user_id = u.id
    AND mesasge_logs.send_date = CURRENT_DATE
    AND mesasge_logs.status = 'sent'
  ```

- Cleanup data: in case the data is not needed (no need to check any metrics anymore), after 1 month I can delete those messages by running a monthly cron task.

# Project Documentation

## Preinstallation

### Environment Requirements

- **Node.js**: 18.x.x
- **pnpm**: [https://www.npmjs.com/package/pnpm](https://www.npmjs.com/package/pnpm)
- **pm2**: [https://www.npmjs.com/package/pm2](https://www.npmjs.com/package/pm2)

### Database Requirements

- **PostgreSQL**
- **Redis**

## Initialize

### Migrations

Run the database migrations with the following command:

```bash
pnpm migration:run
```

### Data Seeding

To seed the database with initial data, run:

```bash
pnpm db:seed
```

### Start Worker

Workers are responsible for handling background tasks such as job processing, logging, or event handling. Below are the commands to manage workers:

- To start the worker

  ```bash
  pnpm start:worker
  ```

- To monitor the status and logs of the worker

  ```bash
  pnpm worker:watch
  ```

- To stop and delete the worker

  ```bash
  pnpm worker:delete
  ```

### Environments

Before starting the application, ensure the following environment variables are set up in your .env file. Below is a copy from .env.example

```code
NODE_ENV=development

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_SYNCHRONIZE=true
DB_LOGGING=false

# pipedream
PD_HOSTNAME=
PD_PORT=
PD_PATH=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

### Start Project

For development mode, use:

```bash
pnpm start:dev
```

### Run test

```bash
pnpm test
```

## How to Work

### Description

Currently, due to Pipedream's limit of 10 requests per day for free account tiers, a dummy task has been implemented to log user data. This task can be easily replaced by changing the class in the `QueueModule`.

### Code Example

To replace the task, modify the QueueModule providers as follows:

```code
providers: [
  QueueService,
  WorkerProcessor,
  {
    provide: 'IBirthdayJobHandler',
    useClass: SaveLogBirthdayJob, // Replace task if necessary
  },
],
```

### Schedule

At the moment, the schedule is configured to run every hour. You can easily update the schedule by replacing the following code in the schedule configuration:

```code
@Cron(CronExpression.EVERY_HOUR) // Replace schedule if necessary
```
