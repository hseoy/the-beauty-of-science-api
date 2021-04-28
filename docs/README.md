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
- [Post](#post)
  - [GET /api/posts](#get-apiposts)
  - [POST /api/posts](#post-apiposts)
  - [GET /api/posts/:id](#get-apipostsid)
  - [PUT /api/posts/:id](#put-apipostsid)
  - [DELETE /api/posts/:id](#delete-apipostsid)
  - [GET /api/posts/:id/comments](#get-apipostsidcomments)
  - [POST /api/posts/:id/comments](#post-apipostsidcomments)
  - [PUT /api/posts/:id/comments](#put-apipostsidcomments)
  - [DELETE /api/posts/:id/comments](#delete-apipostsidcomments)
  - [GET /api/posts/:id/score](#get-apipostsidscore)
  - [POST /api/posts/:id/score](#post-apipostsidscore)
  - [PUT /api/posts/:id/score](#put-apipostsidscore)
  - [DELETE /api/posts/:id/score](#delete-apipostsidscore)

---

## Root

### GET /

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

### POST /api/auth/signup

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

### POST /api/auth/signin

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

### GET /api/auth/signout

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

### GET /api/auth/refresh

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

### GET /api/users

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

### GET /api/users/:id

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

### GET /api/users/:id/avatar

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

### GET /api/users/me

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

### PUT /api/users/me

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

### DELETE /api/users/me

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

### GET /api/users/me/avatar

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

### POST /api/users/me/avatar

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

### PUT /api/users/me/avatar

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

### DELETE /api/users/me/avatar

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

## Post

### GET /api/posts

Queries:

|   query    | description           | is required |
| :--------: | --------------------- | :---------: |
| `category` | category of posts     |    `yes`    |
|  `offset`  | offset for pagination |    `no`     |
|  `limit`   | limit for pagination  |    `no`     |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
// post identifier list. Can contain more elements
[1, 2, 3]
```

Error Response:

| Status Code |         Message          |
| :---------: | :----------------------: |
|    `400`    |   unable to find posts   |
|    `400`    | invalid query parameters |

### POST /api/posts

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

Request Body:

```jsonc
// post object to upload
{
  "title": "Hello, The Beauty of Science", // title of the post
  "content": "# Hello ...", // markdown content of the post
  "category": "common" // category of the post
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // post identifier
  "authorid": 1, // user identifier of the author
  "category": "common", // category of the post
  "title": "Hello, The Beauty of Science", // title of the post
  "content": "# Hello ...", // markdown content of the post
  "created": "2021-04-28T04:42:21.864Z", // creation date of the post
  "modified": "2021-04-28T04:42:21.864Z" // last modification date of the post
}
```

Error Response:

| Status Code |        Message        |
| :---------: | :-------------------: |
|    `400`    | unable to create post |
|    `401`    |     Unauthorized      |

### GET /api/posts/:id

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // post identifier
  "authorid": 1, // user identifier of the author
  "category": "common", //category of the post
  "title": "Hello, The Beauty of Science", // title of the post
  "content": "# Hello ...", // markdown of the post
  "created": "2021-04-28T04:42:21.864Z", // creation date of the post
  "modified": "2021-04-28T04:42:21.864Z", // last modification date of the post
  "author": "test", // name of the author
  "participantCnt": 0, // number of people who gave points
  "total": 0, // total score of the post
  "average": 0 // average score of the post
}
```

Error Response:

| Status Code |       Message       |
| :---------: | :-----------------: |
|    `400`    | unable to find post |

### PUT /api/posts/:id

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

Request Body:

```jsonc
// post object to update
{
  "title": "Updated", // title of the post
  "content": "# Updated", // markdown content of the post
  "category": "common" // category of the post
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
// updated post object
{
  "id": 1, // post identifier
  "authorid": 1, // user identifier of the author
  "category": "common", //category of the post
  "title": "Updated", // title of the post
  "content": "# Updated", // markdown of the post
  "created": "2021-04-28T04:42:21.864Z", // creation date of the post
  "modified": "2021-04-28T05:06:55.349Z" // last modification date of the post
}
```

Error Response:

| Status Code |        Message        |
| :---------: | :-------------------: |
|    `400`    | unable to update post |
|    `401`    |     Unauthorized      |

### DELETE /api/posts/:id

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Error Response:

| Status Code |        Message        |
| :---------: | :-------------------: |
|    `400`    | unable to delete post |
|    `401`    |     Unauthorized      |

### GET /api/posts/:id/comments

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Queries:

|    query    | description                                                                | is required |
| :---------: | -------------------------------------------------------------------------- | :---------: |
| `commentid` | comment identifier to get. if it is null, this api will return comment ids |    `no`     |
|  `offset`   | offset for pagination                                                      |    `no`     |
|   `limit`   | limit for pagination                                                       |    `no`     |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
// comment identifier list. Can contain more elements
[1, 2, 3]
```

```jsonc
// Or
{
  "id": 1, // comment identifier
  "postid": 1, // parent post identifier
  "parentid": 0, // parent comment identifier
  "authorid": 1, // user identifier of the author
  "content": "Hello", // content of the comment
  "created": "2021-04-28T06:48:25.444Z", // creation date of the comment
  "modified": "2021-04-28T06:48:25.444Z" // last modification date of the comment
}
```

Error Response:

| Status Code |         Message         |
| :---------: | :---------------------: |
|    `400`    | unable to find comments |
|    `400`    | unable to find comment  |

### POST /api/posts/:id/comments

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

Request Body:

```jsonc
{
  // identifier of parent comment for nested comments.
  // if this value is zero, This means that it is not child.
  "parentid": 0,
  "content": "Hello" // content of the comment
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // comment identifier
  "postid": 1, // parent post identifier
  "parentid": 0, // parent comment identifier
  "authorid": 1, // user identifier of the author
  "content": "Hello", // content of the comment
  "created": "2021-04-28T06:48:25.444Z", // creation date of the comment
  "modified": "2021-04-28T06:48:25.444Z" // last modification date of the comment
}
```

Error Response:

| Status Code |         Message          |
| :---------: | :----------------------: |
|    `400`    | unable to create comment |
|    `401`    |       Unauthorized       |

### PUT /api/posts/:id/comments

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Queries:

|    query    | description                  | is required |
| :---------: | ---------------------------- | :---------: |
| `commentid` | comment identifier to update |    `yes`    |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

Request Body:

```jsonc
{
  // identifier of parent comment for nested comments.
  // if this value is zero, This means that it is not child.
  "parentid": 0,
  "content": "Updated" // content of the comment
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
// updated comment object
{
  "id": 1, // comment identifier
  "postid": 1, // parent post identifier
  "parentid": 0, // parent comment identifier
  "authorid": 1, // user identifier of the author
  "content": "Updated", // content of the comment
  "created": "2021-04-28T06:48:25.444Z", // creation date of the comment
  "modified": "2021-04-28T07:16:10.426Z" // last modification date of the comment
}
```

Error Response:

| Status Code |         Message          |
| :---------: | :----------------------: |
|    `400`    | unable to update comment |
|    `400`    | invalid query parameters |
|    `401`    |       Unauthorized       |

### DELETE /api/posts/:id/comments

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Error Response:

| Status Code |         Message          |
| :---------: | :----------------------: |
|    `400`    | unable to delete comment |
|    `401`    |       Unauthorized       |

### GET /api/posts/:id/score

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Queries:

|  query   | description                                                                                                                | is required |
| :------: | -------------------------------------------------------------------------------------------------------------------------- | :---------: |
| `userid` | user identifier to get evaluation scores for specific user only. if it is null, this api will return all data for the post |    `no`     |

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // score identifier
  "postid": 1, // parent post identifier
  "score": 5, // evaluation score for the post
  "evaluatorid": 1 // user identifier of evaluator
}
```

```jsonc
// Or
[
  {
    "id": 1, // score identifier
    "postid": 1, // parent post identifier
    "score": 5, // evaluation score for the post
    "evaluatorid": 1 // user identifier of evaluator
  }
]
```

Error Response:

| Status Code |        Message         |
| :---------: | :--------------------: |
|    `400`    | unable to create score |
|    `401`    |      Unauthorized      |

### POST /api/posts/:id/score

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

```jsonc
{
  "score": 5 // evaluation score 0 ~ 5
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // score identifier
  "postid": 1, // parent post identifier
  "score": 5, // evaluation score for the post
  "evaluatorid": 1 // user identifier of evaluator
}
```

Error Response:

| Status Code |        Message         |
| :---------: | :--------------------: |
|    `400`    | unable to create score |
|    `401`    |      Unauthorized      |

### PUT /api/posts/:id/score

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |
| `Content Type`  |      `application/json`      |

```jsonc
{
  "score": 4 // evaluation score 0 ~ 5
}
```

Response Header:

|      Key       |       Value        |
| :------------: | :----------------: |
| `Content Type` | `application/json` |

Response Body:

```jsonc
{
  "id": 1, // score identifier
  "postid": 1, // parent post identifier
  "score": 4, // evaluation score for the post
  "evaluatorid": 1 // user identifier of evaluator
}
```

Error Response:

| Status Code |        Message         |
| :---------: | :--------------------: |
|    `400`    | unable to update score |
|    `401`    |      Unauthorized      |

### DELETE /api/posts/:id/score

Path Variable:

| Variable |    Description    |
| :------: | :---------------: |
|   `id`   | `post identifier` |

Request Header:

|       Key       |            Value             |
| :-------------: | :--------------------------: |
| `Authorization` | `Bearer [Access Token(JWT)]` |

Error Response:

| Status Code |        Message         |
| :---------: | :--------------------: |
|    `400`    | unable to delete score |
|    `401`    |      Unauthorized      |

---
