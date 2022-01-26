# Spotify Backend App

---

### Base URL: http://localhost:8000

---

## Routes for User Auth

### to register a new user

- user/register :post

```js
{
    name: String,
    email: String,
    password: String,
}
```

### to login a new user

- user/login :post

```js
{
    email: String,
    password: String,
}
```
