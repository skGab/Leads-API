import path from 'path';

// Get the NODE_ENV value
const env = process.env.NODE_ENV;

// Set the path based on the environment
const credentialsPath =
  env === 'production'
    ? '../www/data/credentials.json'
    : '../data/credentials.json';

// Set up the auth object using environment variables or default values
export const auth = {
  keyFilename: path.join(__dirname, credentialsPath),
  projectId: 'black-beans-dados',
};
