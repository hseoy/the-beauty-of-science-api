![Banner](./images/banner.png)

This is an Express REST API service for `The Beauty of Science`.

Deployed by Heroku : [Click!](https://the-beauty-of-science-api.herokuapp.com/)

## Table of content

- [Technologies](#technologies)
- [API Spec](#api-spec)
- [Setting up a project](#setting-up-a-project)
- [Environment variables](#environment-variables)
  - [Common environment variables](#common-environment-variables)
  - [Development environment variables](#development-environment-variables)
  - [Production environment variables](#production-environment-variables)
- [Npm custom commands](#npm-custom-commands)
- [Test and coverage](#test-and-coverage)
- [Deployment](#deployment)
- [LICENSE](#license)

---

## Technologies

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Babel](https://babeljs.io/)
- [Jest](https://jestjs.io/)
- [ESlint](https://eslint.org/)
- [Prettier](https://prettier.io/)

**[⬆ Back to Top](#Table-of-content)**

---

## API Spec

> You can read api specification below :

- [Click!](https://hseoy.github.io/the-beauty-of-science-api/)

**[⬆ Back to Top](#Table-of-content)**

---

## Setting up a project

1. Download the source code using git

```
git clnoe https://github.com/hseoy/the-beauty-of-science-api.git
```

2. We use PostgreSQL and Redis to store the data. Please install it.

```
# Create the file repository configuration:
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update the package lists:
$ sudo apt-get update

# Install the latest version of PostgreSQL.
$ sudo apt-get -y install postgresql

# Install redis server
$ sudo apt-get install redis-server

# start redis server
$ redis-server --daemonize yes
```

3. Set up the database.

```
# Create the_beauty_of_science postgres database
$ createdb the_beauty_of_science

# Create tables for this project
$ chmod +x create_tables.sh
$ ./create_tables.sh

# Check
$ psql the_beauty_of_science
$ the_beauty_of_science=# \d
```

4. install the packages through npm

```
npm install
```

**[⬆ Back to Top](#Table-of-content)**

---

## Environment variables

Environment variables can be set by writing in the `.env` file.

`.env.dev` : Environment variables used in development

`.env` : Environment variables used for production. This is not included in version control.

### Common environment variables

- NODE_ENV : `development` or `production` (default : `development`)

- PORT : server port number (default : `5000`)

- JWT_ALGORITHM : algorithm for JWT. ex - `HS256`, `RS256`, ...

- JWT_SECRET : secret string for JWT

- JWT_EXPIRE_ACCESS :the expiration time of the access token (Hour)

- JWT_EXPIRE_REFRESH : the expiration time of the refresh token (Hour)

### Development environment variables

- REDIS_HOST : ip address of the redis server running. ex - `127.0.0.1`

- REDIS_PORT : port number of the redis server running. ex - `6379`

- DB_HOST : postgres ip address. ex - `127.0.0.1`

- DB_USERNAME : database user name.

- DB_PASSWORD : database user password.

- DB_NAME : database name. ex - `the_beauty_of_science`

### Production environment variables

- DATABASE_URL : Set by `Heroku Postgres`

- REDIS_TLS_URL : Set by `Heroku Redis`

- REDIS_URL : Set by `Heroku Redis`

**[⬆ Back to Top](#Table-of-content)**

---

## Npm custom commands

We defined some commands for convenience:

- `npm run start` : Run the server in production mode

- `npm run dev` : Run the server in development mode

- `npm run lint` : Run eslint

- `npm run lint:fix` : Run Eslint to fix the errors

- `npm run build` : Build code

- `npm run predeploy` : Prepare for deployment

- `npm run test` : Run test code

- `npm run coverage` : Run test code and generates a coverage report.

**[⬆ Back to Top](#Table-of-content)**

---

## Test and coverage

> You can execute the test code using the commands below

```
$ npm run test
$ npm run coverage
```

The command `npm run coverage` generates a coverage report, which can be found [here](https://hseoy.github.io/the-beauty-of-science-api/coverage/)

**[⬆ Back to Top](#Table-of-content)**

---

## Deployment

We deploy using heroku.

1. Create deploy branch for deployment.

```
$ git checkout --orphan deploy
$ git reset --hard
$ git commit --allow-empty -m "Init deploy branch"
$ git checkout main
```

2. Then, mount the branch as a subdirectory using git worktree:

```
$ git worktree add dist deploy
```

3. Build

```
$ npm run build
```

4. Deploy to heroku after commit

```
$ cd dist
$ git add .
$ git commit -s -m "Update"
$ git push heroku deploy:main
```

**[⬆ Back to Top](#Table-of-content)**

---

## LICENSE

MIT © [hseoy](https://github.com/hseoy)
