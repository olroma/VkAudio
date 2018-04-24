class Config {
  constructor() {
    this.cookie = undefined;
    this.userId = undefined;
    let isConfigReady = false;

    this.setInfo = (userId, cookie) => {
      if (!userId || !cookie) {
        console.log('[CONFIG] - Params can not be an empty!');
        return;
      }else if (parseInt(userId) == "NaN") {
        console.log('[CONFIG] - UserId should be a number!');
        return;
      }

      this.userId = parseInt(userId);
      this.cookie = cookie;
      isConfigReady = true;
    };

    this.getVkCredits = () => {
      if (!isConfigReady) return undefined;
      return {
        cookie: this.cookie,
        userId: this.userId,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
      }
    };
  }
}

module.exports = new Config();