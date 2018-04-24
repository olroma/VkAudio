# VkAudio
Provide you a npm package, that allow you to get information about audio (with link's to download it) from vk

## Install
Install via npm:
```
npm i vkaudio -s
```

## Usage
```javascript
let VkAudio = require('vkaudio');

const credits = {
  id: 'HERE_USER_ID',
  cookie: 'HERE_COOKIE_FROM_VK'
};

const getTracks = new VkAudio(credits.id, credits.cookie).getTracks();

getTracks.then(tracks => {
    console.log(`Count tracks: ${tracks.length}`);
    console.log(`Tracks: ${tracks}`);
}).catch(err => {
    console.log(err);
});
```