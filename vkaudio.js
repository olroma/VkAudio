class VkAudio {
  constructor(userId, cookie) {
    const lib = {
      querystring: require('querystring'),
      iconv: require('iconv-lite')
    };
    const config = require('./config');
    config.setInfo(userId, cookie);

    const r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=";
    const l = {
      v: (t) => t.split("").reverse().join(""),
      r: (t, e) => {
        t = t.split("");
        for (var i, o = r + r, a = t.length; a--;)
        i = o.indexOf(t[a]), ~i && (t[a] = o.substr(i - e, 1));
        return t.join("")
      },
      s: (t, e) => {
        var i = t.length;
        if (i) {
          var o = s(t, e),
              a = 0;
          for (t = t.split(""); ++a < i;)
              t[a] = t.splice(o[i - 1 - a], 1, t[a])[0];
          t = t.join("")
        }
        return t
      },
      i: (t, e) => {
        return l.s(t, e ^ config.getVkCredits().userId)
      },
      x: (t, e) => {
        var i = [];
        return e = e.charCodeAt(0),
        each(t.split(""), function(t, o) {
            i.push(String.fromCharCode(o.charCodeAt(0) ^ e))
        }),
        i.join("")
      }
    };
    const a = (t) => {
      if (!t || t.length % 4 == 1) return !1;
      for (var e, i, o = 0, a = 0, s = ""; i = t.charAt(a++);)
          i = r.indexOf(i), ~i && (e = o % 4 ? 64 * e + i : i, o++ % 4) && (s += String.fromCharCode(255 & e >> (-2 * o & 6)));
      return s
    };
    const s = (t, e) => {
      var i = t.length, o = [];
      if (i) {
          var a = i;
          for (e = Math.abs(e); a--;)
          e = (i * (a + 1) ^ e + a) % i,
          o[a] = e
      }
      return o;
    };
    const prepare = (data) => {
      let res = lib.iconv.decode(data, 'win1251');
      let json_data = res.split('<!>')[5];
      let json;
      try {
        json = JSON.parse(json_data.slice(7));
      } catch (e) {
        return {error: '[VkAudio] - Wrong answer from vk. Possible wrong userId or cookie ;('}
      }
      return json;
    };
    const getSources = (playlist) => {   
      playlist = playlist.filter(x => x.src);
      return playlist.map(track => track);
    };
    const getRealLink = (t) => {
      if ( ~t.indexOf("audio_api_unavailable")) {
        var e = t.split("?extra=")[1].split("#"), o = "" === e[1] ? "" : a(e[1]);
        if (e = a(e[0]), "string" != typeof o || !e)
          return t;
        o = o ? o.split(String.fromCharCode(9)) : [];
        for (var s, r, n = o.length; n--;) {
          if (r = o[n].split(String.fromCharCode(11)),
            s = r.splice(0, 1, e)[0], !l[s])
            return t;
          e = l[s].apply(null, r)
        }
        if (e && "http" === e.substr(0, 4))
          return e
      }
      return t
    };
    const getAllAudio = (payload, callback) =>  {
      const credits = config.getVkCredits();
      let post_data = lib.querystring.stringify(payload);
      let post_options = {
          host: 'vk.com',
          scheme: 'https',
          port: '443',
          path: '/al_audio.php',
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(post_data),
              'Cookie': credits.cookie,
              'user-agent': credits.userAgent
          }
      };
      return {
          options: post_options,
          data: post_data
      };
    };
    const httpsRequest = (params, postData) => {
      return new Promise(function (resolve, reject) {
        var req = require('https').request(params, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300)
            return reject(new Error('statusCode=' + res.statusCode));
          var body = [];
          res.on('data', function (chunk) {
            body.push(chunk);
          });

          res.on('end', function () {
            try {
              body = Buffer.concat(body);
            } catch (e) {
              reject(e);
            }
            resolve(body);
          });
        });

        req.on('error', function (err) {
            reject(err);
        });

        if (postData) req.write(postData);
        req.end();
      });
    };

    this.getTracks = () => {
      return new Promise((resolve, reject) => {
        let pd = {
            'al': 1,
            'act': 'load_section',
            'owner_id': config.getVkCredits().userId,
            'type': 'playlist',
            'playlist_id': '-1',
            'offset': 0
        };
        let res = getAllAudio(pd);
        httpsRequest(res.options, res.data).then(result => {
          res = prepare(result);
          if (res.error) reject(res.error);
          let list = res.list.map(x => {
              return {
                trackId: x[0],
                src: x[2],
                title: x[3],
                author: x[4],
                duration: x[5]
              }
          });
          list = getSources(list);
          for (let i = 0; i < list.length; i++)
            list[i].src = getRealLink(list[i].src);
          resolve(list);
        }).catch(err => {
          reject(`[VkAudio] - Error! ${err}`);
        });
      });
    };
  }
}

module.exports = VkAudio;