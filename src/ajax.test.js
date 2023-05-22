import ajax from "./ajax";

const unmockedFetch = global.fetch;
const unmockedFileList = global.FileList;

beforeEach(() => {
  const resObj = {
    status: 200,
    json: () => [],
    headers: { get: () => "application/json" },
  };

  // Mock FileList Object
  class FileList {
    [Symbol.iterator]() {
      let index = -1;
      const data = {
        0: new File(["foo"], "foo.txt"),
        1: new File(["bar"], "bar.txt"),
        length: 2,
      };

      return {
        next: () => ({ value: data[++index], done: !(index in data) }),
      };
    }
  }

  global.FileList = FileList;
  global.fetch = jest.fn().mockResolvedValue(resObj);
});

afterEach(() => {
  global.fetch = unmockedFetch;
  global.FileList = unmockedFileList;
});

describe("ajax.get", () => {
  test("GET request with no query params", async () => {
    const res = await ajax.get("http://localhost");

    const args = global.fetch.mock.calls[0];

    expect(res).toStrictEqual([200, []]);
    expect(args[0]).toBe("http://localhost");
    expect(args[1].method).toBe("GET");
  });

  test("GET request with query params", async () => {
    await ajax.get("http://localhost", { foo: "bar", bar: "baz" });

    expect(fetch.mock.calls[0][0]).toBe("http://localhost&foo=bar&bar=baz");
  });

  test("GET request with custom headers", async () => {
    await ajax.get("http://localhost", null, { csrf: "abc" });

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
  });

  test("GET request returns text for content-type text/plain", async () => {
    const resObj = {
      status: 200,
      text: () => "foo",
      headers: { get: () => "text/plain" },
    };

    global.fetch = jest.fn().mockResolvedValue(resObj);

    const [, res] = await ajax.get("http://localhost");

    expect(res).toBe("foo");
  });

  test("GET request returns FormData for content-type multipart/form-data", async () => {
    const resObj = {
      status: 200,
      formData: () => new FormData(),
      headers: { get: () => "multipart/form-data" },
    };

    global.fetch = jest.fn().mockResolvedValue(resObj);

    const [, res] = await ajax.get("http://localhost");

    expect(res instanceof FormData).toBe(true);
  });

  test("GET request returns ReadableStream if content-type not matching json, text or FormData", async () => {
    class ReadableStream {}

    const resObj = {
      status: 200,
      body: new ReadableStream(),
      headers: { get: () => "application/octet-stream" },
    };

    global.fetch = jest.fn().mockResolvedValue(resObj);

    const [, res] = await ajax.get("http://localhost");

    expect(res instanceof ReadableStream).toBe(true);
  });
});

describe("ajax.post", () => {
  test("POST request with no payload data", async () => {
    const res = await ajax.post("http://localhost");

    const args = fetch.mock.calls[0];

    expect(res).toStrictEqual([200, []]);
    expect(args[0]).toBe("http://localhost");
    expect(args[1].method).toBe("POST");
  });

  test("POST request with payload data", async () => {
    await ajax.post("http://localhost", { foo: "bar", bar: "baz" });

    expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );

    expect(fetch.mock.calls[0][1].body.toString()).toBe("foo=bar&bar=baz");
  });

  test("POST request with custom headers", async () => {
    await ajax.post("http://localhost", null, { csrf: "abc" });

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
  });
});

describe("ajax.put", () => {
  test("PUT request with no payload data", async () => {
    const res = await ajax.put("http://localhost");

    const args = fetch.mock.calls[0];

    expect(res).toStrictEqual([200, []]);
    expect(args[0]).toBe("http://localhost");
    expect(args[1].method).toBe("PUT");
  });

  test("PUT request with payload data", async () => {
    await ajax.put("http://localhost", { foo: "bar", bar: "baz" });

    expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );

    expect(fetch.mock.calls[0][1].body.toString()).toBe("foo=bar&bar=baz");
  });

  test("PUT request with custom headers", async () => {
    await ajax.put("http://localhost", null, { csrf: "abc" });

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
  });
});

describe("ajax.delete", () => {
  test("DELETE request with no payload data", async () => {
    const res = await ajax.delete("http://localhost");

    const args = fetch.mock.calls[0];
    expect(res).toStrictEqual([200, []]);
    expect(args[0]).toBe("http://localhost");
    expect(args[1].method).toBe("DELETE");
  });

  test("DELETE request with payload data", async () => {
    await ajax.delete("http://localhost", { foo: "bar", bar: "baz" });

    expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );

    expect(fetch.mock.calls[0][1].body.toString()).toBe("foo=bar&bar=baz");
  });

  test("DELETE request with custom headers", async () => {
    await ajax.delete("http://localhost", null, { csrf: "abc" });

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
  });
});

describe("ajax.put", () => {
  test("PUT request with no payload data", async () => {
    const res = await ajax.put("http://localhost");

    const args = fetch.mock.calls[0];
    expect(res).toStrictEqual([200, []]);
    expect(args[0]).toBe("http://localhost");
    expect(args[1].method).toBe("PUT");
  });

  test("PUT request with payload data", async () => {
    await ajax.put("http://localhost", { foo: "bar", bar: "baz" });

    expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBe(
      "application/x-www-form-urlencoded"
    );

    expect(fetch.mock.calls[0][1].body.toString()).toBe("foo=bar&bar=baz");
  });

  test("PUT request with custom headers", async () => {
    await ajax.put("http://localhost", null, { csrf: "abc" });

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
  });
});

describe("ajax.uploadFile", () => {
  test("Upload single file with POST method", async () => {
    const res = await ajax.uploadFile(
      "http://localhost",
      "POST",
      new File(["foo"], "foo.txt")
    );

    const args = fetch.mock.calls[0];

    expect(res).toStrictEqual([200, []]);
    expect(args[0]).toBe("http://localhost");
    expect(args[1].method).toBe("POST");
    expect(args[1].body instanceof FormData).toBe(true);
    expect(args[1].body.get(0) instanceof File).toBe(true);
  });

  test("Upload file with POST method using FormData", async () => {
    const fd = new FormData();
    fd.append("file", new File(["foo"], "foo.txt"));

    await ajax.uploadFile("http://localhost", "POST", fd);

    const args = fetch.mock.calls[0];

    expect(args[1].body instanceof FormData).toBe(true);
    expect(args[1].body.get("file") instanceof File).toBe(true);
  });

  test("Upload multiple files with PUT method", async () => {
    await ajax.uploadFile("http://localhost", "PUT", new FileList());

    const args = fetch.mock.calls[0];

    expect(args[1].method).toBe("PUT");
    expect(args[1].body instanceof FormData).toBe(true);
    expect(args[1].body.get(0) instanceof File).toBe(true);
    expect(args[1].body.get(1) instanceof File).toBe(true);
  });

  test("uploadFile with GET request throws an Exception", async () => {
    const res = await ajax
      .uploadFile("http://localhost", "GET", new File(["foo"], "foo.txt"))
      .catch((err) => err);

    expect(res.message).toBe("Method must be one of POST, PUT. Got GET");
  });

  test("Upload file with POST method using Object throws Exception", async () => {
    const res = await ajax
      .uploadFile("http://localhost", "POST", {})
      .catch((err) => err);

    expect(res.message).toBe("File or FileList object expected. Got Object");
  });

  test("Upload file with custom headers", async () => {
    await ajax.uploadFile(
      "http://localhost",
      "POST",
      new File(["foo"], "foo.txt"),
      { csrf: "abc" }
    );

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
  });
});

describe("ajax.setHeader", () => {
  test("Custom header with setHeader must persist between requests", async () => {
    ajax.setHeader("csrf", "abc");

    await ajax.get("http://localhost");
    await ajax.get("http://localhost");

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");
    expect(fetch.mock.calls[1][1].headers["csrf"]).toBe("abc");
  });
});

describe("ajax.removeHeader", () => {
  test("Remove header from GET request using removeHeader", async () => {
    ajax.setHeader("csrf", "abc");
    await ajax.get("http://localhost");

    expect(fetch.mock.calls[0][1].headers["csrf"]).toBe("abc");

    ajax.removeHeader("csrf");
    await ajax.get("http://localhost");

    expect("csrf" in fetch.mock.calls[1][1].headers).toBe(false);
  });
});
