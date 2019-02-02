var Ajax = (function () {
    "use strict";
    var serverErr = "Server error. Please try again.",
        connErr = "Connection error. Please try again.",

        init = function (req) {

            req.retry = (
                (req.retry && req.retry % 1 === 0)
                ? req.retry
                : 1
            );
            req.url = req.url || document.location.pathname;

            var x = new XMLHttpRequest();
            x.open(req.method, req.url);
            x.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            if (req.callback === undefined) {
                return x;
            }

            x.onload = function () {
                var key;

                if (x.status >= 400) {
                    return req.callback({ status: "fail", detail: serverErr }, req.el || null);
                }

                if (x.getResponseHeader("Content-Type") === "application/json") {
                    key = JSON.parse(x.responseText);
                } else {
                    key = x.responseText;
                }

                req.callback(key, req.el || null);
            };

            x.onerror = function () {
                if (req.retry && navigator.onLine) {
                    req.retry -= 1;
                    return init(req);
                }
                req.callback({ status: "fail", detail: connErr }, req.el || null);
            };

            return x;
        },

        encodeData = function (data) {
            var payload = [],
                key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    payload.push(
                        encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
                    );
                }
            }
            return payload.join("&");
        };

    return {
        get: function (req) {
            req = req || {};

            req.method = "GET";
            if (req.data) {
                req.url += ("?" + encodeData(req.data));
            }
            init(req).send();
        },
        post: function (req) {
            req = req || {};
            var data = (
                    req.data
                    ? encodeData(req.data)
                    : null
                ),
                x;

            req.method = "POST";

            x = init(req);
            x.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
            );
            x.send(data);
        }
    };
}());
