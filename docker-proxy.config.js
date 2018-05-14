const PROXY_CONFIG = {
  "/api/*": {
    "target": "http://127.0.0.1:6420",
    "pathRewrite": {
      "^/api" : ""
    },
    "secure": false,
    "logLevel": "debug",
    "bypass": function (req) {
      req.headers["origin"] = 'http://0.0.0.0:6420';
      req.headers["host"] = '0.0.0.0:6420';
      req.headers["referer"] = 'http://0.0.0.0:6420';
    }
  }
};

module.exports = PROXY_CONFIG;