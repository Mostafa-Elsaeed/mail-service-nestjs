export const appConfig = () => ({
  app: {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT || '3000', 10),
    devEmail: process.env.DEV_EMAIL,
  },
});
