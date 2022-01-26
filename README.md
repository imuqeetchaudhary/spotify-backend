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

## Routes for Tracks

### To get an audio, video track

- tracks/:id: :get (where id === trackId)

### To post an audio, video track

- tracks :post

```js
    track: File,
    trackName: String,
```

### To get all Track Files

- tracks :get

### To get all Track Files for a specific Publisher who published them

- tracks/for-publisher :get
