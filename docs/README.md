# APIs

[https://the-beauty-of-science-api.herokuapp.com](https://the-beauty-of-science-api.herokuapp.com/)

## Table of content

- [Root](#root)
  - [GET /](#get-)
- [Auth](#auth)
  - [POST /api/auth/signup](#post-apiauthsignup)
  - [POST /api/auth/signin](#post-apiauthsignin)
  - [GET /api/auth/signout](#get-apiauthsignout)
  - [GET /api/auth/refresh](#get-apiauthrefresh)
- [User](#user)
  - [GET /api/users](#get-apiusers)
  - [GET /api/users/:id](#get-apiusersid)
  - [GET /api/users/:id/avatar](#get-apiusersidavatar)
  - [GET /api/users/me](#get-apiusersme)
  - [PUT /api/users/me](#put-apiusersme)
  - [DELETE /api/users/me](#delete-apiusersme)
  - [GET /api/users/me/avatar](#get-apiusersmeavatar)
  - [POST /api/users/me/avatar](#post-apiusersmeavatar)
  - [PUT /api/users/me/avatar](#put-apiusersmeavatar)
  - [DELETE /api/users/me/avatar](#delete-apiusersmeavatar)

---

## Root

### `GET /`

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
"This server is working"
```

**[⬆ Back to Top](#table-of-content)**

## Auth

### `POST /api/auth/signup`

Request Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Request Body:

```jsonc
{
  "username": "test", // user name
  "email": "test@gmail.com", // user email
  "password": "test!@#$" // user password
}
```

Response Header:

|      Key       |                 Value                  |
| :------------: | :------------------------------------: |
| `Content Type` |           `application/json`           |
|  `Set-Cookie`  | `X-Refresh-Token=[Refresh Token(JWT)]` |

Response Body:

```jsonc
{
  "access": "[Access Token(JWT)]" // access token for jwt
}
```

Error Response:

| Status Code |        Message         |
| :---------: | :--------------------: |
|    `400`    |    unable to signup    |
|    `400`    |    invalid password    |
|    `409`    | account already exists |

**[⬆ Back to Top](#table-of-content)**

### `POST /api/auth/signin`

Request Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Request Body:

```jsonc
{
  "email": "test@gmail.com", // user email
  "password": "test!@#$" // user password
}
```

Response Header:

|      Key       |                 Value                  |
| :------------: | :------------------------------------: |
| `Content Type` |           `application/json`           |
|  `Set-Cookie`  | `X-Refresh-Token=[Refresh Token(JWT)]` |

Response Body:

```jsonc
{
  "access": "[Access Token(JWT)]" // access token for jwt
}
```

Error Response:

| Status Code |     Message      |
| :---------: | :--------------: |
|    `400`    | unable to signin |

**[⬆ Back to Top](#table-of-content)**

### `GET /api/auth/signout`

Request Header:

|       Key       |                 Value                  |
| :-------------: | :------------------------------------: |
| `Authorization` |      `Bearer [Access Token(JWT)]`      |
|  `Set-Cookie`   | `X-Refresh-Token=[Refresh Token(JWT)]` |

Response Header:

|     Key      |        Value         |
| :----------: | :------------------: |
| `Set-Cookie` | `X-Refresh-Token=''` |

Error Response:

| Status Code |   Message    |
| :---------: | :----------: |
|    `401`    | Unauthorized |

**[⬆ Back to Top](#table-of-content)**

### `GET /api/auth/refresh`

Request Header:

|     Key      |                 Value                  |
| :----------: | :------------------------------------: |
| `Set-Cookie` | `X-Refresh-Token=[Refresh Token(JWT)]` |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "access": "[Access Token(JWT)]" /// access token for jwt
}
```

Error Response:

| Status Code |   Message    |
| :---------: | :----------: |
|    `401`    | Unauthorized |

**[⬆ Back to Top](#table-of-content)**

---

## User

### `GET /api/users`

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
// user identifier list. Can contain more elements
[1, 2, 3]
```

Error Response:

| Status Code |       Message        |
| :---------: | :------------------: |
|    `400`    | unable to find users |

**[⬆ Back to Top](#table-of-content)**

### `GET /api/users/:id`

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `user identifier` |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // user identifier
  "username": "test", // user name
  "email": "test@gmail.com", // user email
  "experience": "1234", // experience point for level
  "postcnt": "10", // number of user-created posts
  "quizcnt": "7", // number of user-created quizzes
  "joined": "2021-04-27T01:25:46.071Z" // sign up date
}
```

Error Response:

| Status Code |       Message       |
| :---------: | :-----------------: |
|    `400`    | unable to find user |

**[⬆ Back to Top](#table-of-content)**

### `GET /api/users/:id/avatar`

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `user identifier` |

Response Header:

|      Key       |                  Value                  |
| :------------: | :-------------------------------------: |
| `Content Type` | `[type of image file uploaded by user]` |

Response Body:

```
image binary file uploaded by user
```

Error Response:

| Status Code |          Message           |
| :---------: | :------------------------: |
|    `400`    | unable to get avatar image |

**[⬆ Back to Top](#table-of-content)**

### `GET /api/users/me`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // user identifier
  "username": "test", // user name
  "email": "test@gmail.com", // user email
  "experience": "1234", // experience point for level
  "postcnt": "10", // number of user-created posts
  "quizcnt": "7", // number of user-created quizzes
  "joined": "2021-04-27T01:25:46.071Z" // sign up date
}
```

Error Response:

| Status Code |       Message       |
| :---------: | :-----------------: |
|    `400`    | unable to find user |
|    `401`    |    Unauthorized     |

**[⬆ Back to Top](#table-of-content)**

### `PUT /api/users/me`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

Request Body:

```jsonc
// user information to update
{
  "username": "testuser" // username to update
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
// updated user object
{
  "id": 1, // user identifier
  "username": "testuser", // user name
  "email": "test@gmail.com", // user email
  "experience": "1234", // experience point for level
  "postcnt": "10", // number of user-created posts
  "quizcnt": "7", // number of user-created quizzes
  "joined": "2021-04-27T01:25:46.071Z" // sign up date
}
```

Error Response:

| Status Code |        Message        |
| :---------: | :-------------------: |
|    `400`    | unable to update user |
|    `401`    |     Unauthorized      |

**[⬆ Back to Top](#table-of-content)**

### `DELETE /api/users/me`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Error Response:

| Status Code |        Message        |
| :---------: | :-------------------: |
|    `400`    | unable to delete user |
|    `401`    |     Unauthorized      |

**[⬆ Back to Top](#table-of-content)**

### `GET /api/users/me/avatar`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Response Header:

|      Key       |                  Value                  |
| :------------: | :-------------------------------------: |
| `Content Type` | `[type of image file uploaded by user]` |

Response Body:

```
image binary file uploaded by user
```

Error Response:

| Status Code |          Message           |
| :---------: | :------------------------: |
|    `400`    | unable to get avatar image |
|    `401`    |        Unauthorized        |

**[⬆ Back to Top](#table-of-content)**

### `POST /api/users/me/avatar`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |    `multipart/form-data`     |

Request Body:

|   Key    |             Value             |
| :------: | :---------------------------: |
| `avatar` | `image binary file to upload` |

Error Response:

| Status Code |         Message         |
| :---------: | :---------------------: |
|    `400`    | unable to update avatar |
|    `401`    |      Unauthorized       |

**[⬆ Back to Top](#table-of-content)**

### `PUT /api/users/me/avatar`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |    `multipart/form-data`     |

Request Body:

|   Key    |             Value             |
| :------: | :---------------------------: |
| `avatar` | `image binary file to upload` |

Error Response:

| Status Code |         Message         |
| :---------: | :---------------------: |
|    `400`    | unable to update avatar |
|    `401`    |      Unauthorized       |

**[⬆ Back to Top](#table-of-content)**

### `DELETE /api/users/me/avatar`

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Error Response:

| Status Code |         Message         |
| :---------: | :---------------------: |
|    `400`    | unable to delete avatar |
|    `401`    |      Unauthorized       |

**[⬆ Back to Top](#table-of-content)**

---
