# WakaTimeJS

Type safe JavaScript client for the WakaTime REST API

## Installation

```bash
npm install wakatimejs
```

or

```bash
yarn add wakatimejs
```

## Usage

consumption is super straight forward, just import the class and instantiate it with your api key.

```javascript
import { WakaTime } from 'wakatimejs'; // or const { WakaTime } = require('wakatimejs');

const wakaTime = new WakaTime('your-api-key');

wakaTime.users.current().then((user) => {
  console.log(user);
});
```

Alternatively, if you don't have access to the api key at the time of instantiation, you can use the `setApiKey` method.

```javascript
import { WakaTime } from 'wakatimejs';

const wakatime = new WakaTime();

// ... later on

wakaTime.setApiKey('your-api-key');

wakaTime.users.current().then((user) => {
  console.log(user);
});
```

## API

The API follows the samme nameing convention for the endpoints as the [REST API](https://wakatime.com/developers).

some of the routes in the REST API require a user id or authentication, but these are handled by the client, so you don't have to worry about them.
