# Simple-CRUD-API

## Installation

Install all dependencies - ```yarn install``` or ```npm install```

## Run application

1. Dev mode - ```yarn start:dev``` or ```npm run start:dev```
2. Prod mode - ```yarn start:prod``` or ```npm run start:prod```
3. Multi mode (prod + clustering) - ```yarn start:multi``` or ```npm run start:multi```
4. Test mode - ```yarn test```  or ```npm run test```

### Dev

Application starts on *port* **4000**. This *port* is defined in ```.env``` file.

### Prod

Application starts on *port* **4000**. This *port* is defined in ```.env``` file.

When this command is run, a folder *```build```* is created with compiled **.js** files.

There are 2 files:

* ```main.js``` (application).
* ```db.js``` (database).

P.S.

This separation is necessary because of the support for clustering. The database is placed in a separate file **db.js** and this allows you to run the child process of the database separately from the general application.

### Multi

Application starts on *port* **4000**. This *port* is defined in ```.env``` file.

When this command is run, a folder *```build```* is created with compiled **.js** files.

There are 2 files:

* ```main.js``` (application).
* ```db.js``` (database).

It works like load balancer that distributes requests across them (using Round-robin algorithm).

For example: host machine has 4 cores, PORT is 4000. On run npm run start:multi it works following way

On *localhost:4000/api* load balancer is listening for requests
On *localhost:4001/api*, *localhost:4002/api*, *localhost:4003/api*, *localhost:4004/api* workers are listening for requests from load balancer

### Test

Application starts on *port* **6000**. This *port* is defined in project config.
This separation allows you to simultaneously run tests without stopping the server.
There are 3 scenarios in total. Path: *```/src/components/user/user.test.ts```*

## API endpoints

### Endpoints

1. **GET** *api/users* - Get all users
2. **GET** *api/users/:id* - Get user by id (where **:id** - *uuid*)
3. **POST** *api/users* - Create user
4. **PUT** *api/users/:id* -  Update user (where **:id** - *uuid*)
5. **DELETE** *api/users/:id* - Delete user (where **:id** - *uuid*)
