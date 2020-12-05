# express-fastest-validator

### 🚀 **Fastest express request validation library** 🚀

Error handling in a large project has always been a complex task in express projects. **express-fastest-validator** eases the pain of the developer in handling the invalid API requests.
**express-fastest-validator** is based on the fastest validations js library [fastest-validator](https://github.com/icebob/fastest-validator).

**express-fastest-validator** provides a request validation middleware which you can plug in your express routes which will validate the express request and throw a Error if any validation rules fails. Yes !! it is this easy to handle invalid requests.

## Installation

Install with npm

```
npm install express-fastest-validator
```

Install with yarn

```
yarn add express-fastest-validator
```

## Request Properties

express-fastest-validator supports multiple [express request properties](https://expressjs.com/en/api.html#req)

- body
- headers
- params
- qs
- query

## Schema Definition

express-fastest-validator uses [fastest-validator](https://github.com/icebob/fastest-validator) which is the the **fastest JS validator library for NodeJS | Browser**.

```javascript
// Schema for validating user login API
const loginSchema = {
  body: {
    username: { type: 'string', min: 3, max: 15 },
    password: { type: 'string', min: 8 },
  },
};
```

Read complete
**[docs](https://github.com/icebob/fastest-validator)
for field types and built-in validators**

## Validating API

You just need to define your schema and plug it into your API route. This is all you need to do.

```javascript
const { express } = require('express');
const { validator } = require('express-fastest-validator');

const app = express();

const loginSchema = {
  body: {
    username: { type: 'string', min: 3, max: 15 },
    password: { type: 'string', min: 8 },
  },
};

app.post('/api/user', validator(loginSchema), userController.login);
```

## Error Handling Middleware

[Express Middleware](https://expressjs.com/en/guide/using-middleware.html) provides the power of handling the request response cycle with ease.

Middleware can be used to handle all the API errors within a single peace of code. You can use a middleware to handle all the API errors in your project. **You can define your error handling middleware after defining all your routes**. This is because we want the error handling middleware to run just before sending the response to check weather the API is returning a valid response or an error.

Read more about [Error-handling Middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling)

```javascript
const errorHandler = (err, req, res, next) => {
  /*
   * FXValidationError will be raised by express-fastest-validator if the request is invalid.
   * FXValidationError.description is an array describing validation errors.
   */
  if (err instanceof FXValidationError) {
    res.status(400).send(err.description);
  }

  // APIError is your custom Error class for api errors.
  if (err instanceof MyAPIError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send('something went wrong');
  }
};

// Now you can use this plug this middleware in your express app.
app.use(errorHandler);
```

## Custom Error Handling Example

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { validator, FXValidationError } = require('express-fastest-validator');

const PORT = 8000;

const schema = {
  params: {
    username: { type: 'string', min: 3, max: 15 },
  },
  body: {
    age: { type: 'number', positive: true, integer: true },
  },
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/user/:username', validator(schema), (req, res) => {
  const { age } = req.body;
  const { username } = req.params;
  res.status(200).send(`Welcome 🔥${username}🔥, you are ${age} years old`);
});

// Set the value of errorHandlerMiddleware to true
app.set('errorHandlerMiddleware', true);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof FXValidationError) {
    // Handle request invalidation error
    res.status(400).send(err.description);
  } else {
    // Handle all the others except request invalidation errors.
    res.status(500).send('something went wrong');
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
```
