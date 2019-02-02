# Ajax.js

A helper function for making Ajax requests.

- Supports GET and POST request methods.
- Checks network connectivity (using __navigator.onLine__) and retries request on error.
- Parses JSON response if __Content-Type__ headers set to __application/json__
- Supports IE9+

## Usage
```javascript
// Make a get request to current page
Ajax.get();

// Make a post request to current page
Ajax.post();
```

## Available options

Pass an object with options to override defaults

- __url__: A url to which the request is sent. Defaults to __current url__.
- __data__: An object with key-value pairs that is appended to the url for __GET__ requests.
Defaults to __null__.
- __retry__: The number of times to retry if the request fails client side. Defaults to __1__.
- __callback__: The function to call if the request succeeds or fails. __Ignored if undefined__.
- __el__: A document node passed to the callback function. __Ignored if undefined__.


```javascript
// Pass an object with options
Ajax.post({
  url: "https://example.com/blog/5356",
  data: { comment: "Very informative, Thanks.", id: 12 },
  retry: 2,
  callback: Comment.responseHandler,
  el: document.forms.comment
});
```
