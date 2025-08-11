export default () => ({
  jwt: {
    accessTokenSecret:
    process.env.ACCESS_TOKEN_SECRET || 'access_default_secret',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',

    refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || 'refresh_default_secret',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRY || '1d',
  },
});
