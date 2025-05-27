Node.js should be installed

npm install i    ---> For installing dependencies

node app.js   ---> TO run the backend


Use Postman for better understanding  ---->

`POST /api/auth/signup`  for registration
Request body (JSON):
{
  "username": "string",
  "email": "string",
  "password": "string"
}

`POST /api/auth/login`   for login
{
  "email": "string",
  "password": "string"
}

`POST /api/books`    for adding a book
{
  "title": "string",
  "author": "string",
  "genre": "string"
}

`POST /api/books/:id/reviews`   for giving review to a book
{
  "rating": number (1-5),
  "comment": "string"
}

`PUT /api/books/:id/reviews`    for updating specific review
{
  "rating": number (1-5),
  "comment": "string"
}

`GET /api/books`    for displaying all the books

`DELETE /api/books/:id/reviews`   for deleting any review

MongoDB database has been used
Schema Design -
1. 3 Entities books, reviews, users
2. All are connected to each other
3. One user can add many books and can also give as much reviews to any book
4. Once registered token is available for 1hr, Thus till 1hr user can add any book and can give any reviews. After 1hr token will be expired
5. Authentication is required to add book and to give review.