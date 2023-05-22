# Ajax.js

A simple wrapper for making Ajax requests using fetch api.

- Supports GET, POST, PUT, DELETE methods.
- Support for small file uploads, setting and removing headers.
- Uses modern ES6 features and async code.
- Fully tested and documented.

# Usage

```javascript
import ajax from "./src/ajax.js"; // path to ajax.js

async function main() {
  // make a GET request with no parameters or headers
  const [code, response] = await ajax.get("https://example.com");
  // [ statusCode, serverResponse ]

  // consume the response
}
```

To make a GET request with query string. Pass a simple Object or FormData

```javascript
const query = { foo: "bar", bar: "baz" };
await ajax.get("https://example.com", query);
// https://example.com?foo=bar&bar=baz
```

To add custom headers, pass an Object as third parameter. Both query and headers are optional.

```javascript
const headers = { "csrf": "abc" };
const payload = {names: ["foo", "bar", "baz"]

// Headers passed this way only apply to the current request
await ajax.post("https://example.com/add", payload, headers)
```

To add headers to all subsequent requests, use the `ajax.setHeader` method.

```javascript
ajax.setHeader("Authorization", "Basic ABCDEFGHIJKLMNOPQRS0123456789");
// all subsequent requests will carry this header.

// remove the header
ajax.removeHeader("Authorization");
```

**To run tests:**

- Clone the repository and `cd` into the project directory.
- Install the dev dependencies with `npm install`
- Once installed, test can be run with `npm run test`

**To run file upload example:**

The `example` folder contains fully working code for uploading files. This code requires [busboy](https://www.npmjs.com/package/busboy) as a dependency.

- Run `npm run postinstall` to install dependencies.
- `cd` into example folder.
- Run `npm run start` to start the server.
- You can now access the site at `http://localhost:3000`

This is a minimal and crude demonstration of file upload and not suitable for production.

# [Documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/BennyThadikaran/ajax/main/docs/index.html)

# Additional Notes

By default,

- `X-Requested-With` header is set to `XMLHttpRequest`. This cannot be changed or modified with `ajax.setHeader` or `ajax.removeHeader` method.
- `Accept` header is set to `application/json`. This can modified with `ajax.setHeader` but not removed.
- `credentials` options passed to Fetch is set to `same-origin`

Ajax module returns a freezed Object. The Object cannot be modified, deleted or added to.

**If Content-Type header in response is set to:**

- **application/json:** returns parsed json
- **text/\*:** returns parsed text.
- **multipart/form-data:** returns FormData object
- **If none of the above matches**, returns the **[response.body](https://developer.mozilla.org/en-US/docs/Web/API/Response/body)** which is a **[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)**. Handle this as required by your application.
