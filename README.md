# HistoryCounter
Simple Node.JS flood control

## Install
```
npm i github:flyink13/historycounter
```

## Usage
```
const HistoryCounter = require("historycounter");
const floodIp = new HistoryCounter();
const max_requests_peer_minute = 60;

(function onRequest() {
  const user_id = 61351294; // req.ip, payload.user_id etc.
  if (floodIp.checkCount(user_id, max_requests_peer_minute)) {
    throw { error: 'flood control' };
  }
})();
```
