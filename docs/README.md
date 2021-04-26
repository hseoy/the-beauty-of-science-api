# APIs

[https://the-beauty-of-science-api.herokuapp.com](https://the-beauty-of-science-api.herokuapp.com/)

## Table of content

- [Root](#root)
  - [GET /](#get-)
- [Auth](#auth)
  - [POST /api/auth/signup](#post-apiauthsignup)
  - [POST /api/auth/signin](#post-apiauthsignin)
  - [GET /api/auth/signout](#get-apiauthsignout)
  - [POST /api/auth/refresh](#post-apiauthrefresh)
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

### GET /

- request header: X
- path variable: X
- query string: X
- request body: X
- response header:
  - `Content-Type`: `application/json`
- response body:
  - (String) : "This server is working."
- error response: X

**[⬆ Back to Top](#table-of-content)**

## Auth

### POST /api/auth/signup

- request header:
  - `Content-Type`: `application/json`
- path variable: X
- query string: X
- request body:
  - email(String): user email
  - username(String): user name
  - password(String): user password
- response header:
  - `Content-Type`: `application/json`
  - `Set-Cookie`:
    - `X-Refresh-Token` : Refresh Token(JWT)
- response body:
  - access(String): Access Token(JWT)
- error response:
  - `400 unable to signup`
  - `400 invalid password`
  - `409 account already exists`

**[⬆ Back to Top](#table-of-content)**

### POST /api/auth/signin

- request header:
  - `Content-Type`: `application/json`
- path variable: X
- query string: X
- request body:
  - email(String): user email
  - password(String): user password
- response header:
  - `Content-Type`: `application/json`
  - `Set-Cookie`:
    - `X-Refresh-Token` : Refresh Token(JWT)
- response body:
  - access(String): Access Token(JWT)
- error response:
  - `400 unable to signin`

**[⬆ Back to Top](#table-of-content)**

### GET /api/auth/signout

- request header:
  - `Authorization`: `Bearer ACCESS_TOKEN`
  - `Set-Cookie`:
    - `X-Refresh-Token` : Refresh Token(JWT)
- path variable: X
- query string: X
- request body: X
- response header: X
- response body: X
- error response:
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### GET /api/auth/refresh

- request header:
  - `Authorization`: `Bearer ACCESS_TOKEN`
  - `Set-Cookie`:
    - `X-Refresh-Token` : Refresh Token(JWT)
- path variable: X
- query string: X
- response header:
  - `Content-Type`: `application/json`
- response body:
  - access(String): Access Token(JWT)
- error response:
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

---

## User

### GET /api/users

- request header: X
- path variable: X
- query string: X
- request body: X
- response header:
  - `Content-Type`: `application/json`
- response body:
  - (Int Array): user identifier list
- error response:
  - `400 unable to find users`

**[⬆ Back to Top](#table-of-content)**

### GET /api/users/:id

- request header: X
- path variable:
  - id(Int) : user identifier
- query string: X
- request body: X
- response header:
  - `Content-Type`: `application/json`
- response body:
  - id(Int): user identifier
  - username(String): user name
  - email(String): user email
  - experience(String): experience point for level
  - postcnt(String-Big Int): number of user-created posts
  - quizcnt(String-Big Int): number of user-created quizzes
  - joined(String-Date): sign up date
- error response:
  - `400 unable to find user`

**[⬆ Back to Top](#table-of-content)**

### GET /api/users/:id/avatar

- request header: X
- path variable:
  - id(Int): user identifier
- query string: X
- request body: X
- response header:
  - Content-Type: type of image file uploaded by user
- response body:
  - image file(Binary): image file uploaded by user
- error response:
  - `400 unable to get avatar image`

**[⬆ Back to Top](#table-of-content)**

### GET /api/users/me

- request header:
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body: X
- response header:
  - `Content-Type`: `application/json`
- response body:
  - id(Int): user identifier
  - username(String): user name
  - email(String): user email
  - experience(String): experience point for level
  - postcnt(String-Big Int): number of user-created posts
  - quizcnt(String-Big Int): number of user-created quizzes
  - joined(String-Date): sign up date
- error response:
  - `400 unable to find user`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### PUT /api/users/me

- request header:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body:
  - user(Object): user information to update
    - username(String): user name
- response header:
  - `Content-Type`: `application/json`
- response body:
  - id(Int): user identifier
  - username(String): user name(update)
  - email(String): user email
  - experience(String): experience point for level
  - postcnt(String-Big Int): number of user-created posts
  - quizcnt(String-Big Int): number of user-created quizzes
  - joined(String-Date): sign up date
- error response:
  - `400 unable to update user`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### DELETE /api/users/me

- request header:
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body: X
- response header: X
- response body: X
- error response:
  - `400 unable to delete user`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### GET /api/users/me/avatar

- request header:
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body: X
- response header:
  - Content-Type: type of image file uploaded by user
- response body:
  - image file(Binary): image file uploaded by user
- error response:
  - `400 unable to get avatar image`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### POST /api/users/me/avatar

- request header:
  - `Content-Type`: `multipart/form-data`
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body:
  - avatar(Binary): image file to upload
- response header: X
- response body: X
- error response:
  - `400 unable to update avatar`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### PUT /api/users/me/avatar

- request header:
  - `Content-Type`: `multipart/form-data`
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body:
  - avatar(Binary): image file to upload
- response header: X
- response body: X
- error response:
  - `400 unable to update avatar`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

### DELETE /api/users/me/avatar

- request header:
  - `Authorization`: `Bearer ACCESS_TOKEN`
- path variable: X
- query string: X
- request body: X
- response header: X
- response body: X
- error response:
  - `400 unable to delete avatar`
  - `401 Unauthorized`

**[⬆ Back to Top](#table-of-content)**

---
