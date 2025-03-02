# Deskify API Documentation

This is a RESTful API for managing applications. The API is built using Node.js, Express.js and Firebase.

## Endpoints

### Packages

* `GET /packages`: Get all packages
* `GET /packages/:id`: Get a package by ID
* `POST /packages`: Create a package
* `PUT /packages/:id`: Update a package
* `DELETE /packages/:id`: Delete a package

### Laptops

* `GET /laptops`: Get all laptops
* `GET /laptops/:id`: Get a laptop by ID
* `POST /laptops`: Create a laptop
* `PUT /laptops/:id`: Update a laptop
* `DELETE /laptops/:id`: Delete a laptop

### Admin

* `POST /admin/login`: Login as admin
* `POST /admin/register`: Register as admin
* `GET /admin/dashboard`: Get admin dashboard

## Authentication

The API uses JSON Web Tokens for authentication. After a successful login or registration, the API will return a JSON Web Token which must be included in the `Authorization` header in the format `Bearer <token>`.

## Request Body

The request body should be in JSON format.

## Response

The response will be in JSON format.

## Environment Variables

The API requires the following environment variables:

* `FIREBASE_ADMIN_CREDENTIALS`: The contents of the Firebase admin credentials file.
* `SECRET_KEY`: The secret key for generating JSON Web Tokens.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
