const VkAudio = require('./vkaudio');
const data = {
  id: 'HERE_USER_ID',
  cookie: 'HERE_COOKIE_FROM_VK'
};

let tracks = new VkAudio(data.id, data.cookie).getTracks();
tracks.then(tracks => {
  console.log(tracks);
}).catch(err => {
  console.warn(err);
});