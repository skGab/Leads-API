import path from 'path';

// Set up the auth object using environment variables or default values
export const auth = {
  keyFilename: path.join(
    __dirname,
    process.env.AUTH_CREDENTIALS ?? '../www/data/credentials.json'
  ),
  projectId: 'black-beans-dados',
};
