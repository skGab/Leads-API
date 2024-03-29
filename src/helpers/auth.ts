import path from 'path';
import { BigQuery } from '@google-cloud/bigquery';

// Get the NODE_ENV value
const env = process.env.NODE_ENV;

// Set the path based on the environment
const credentialsPath =
  env === 'production'
    ? '../www/data/credentials.json'
    : '../data/credentials.json';

// Set up the auth object using environment variables or default values
const auth = {
  keyFilename: path.join(__dirname, credentialsPath),
  projectId: 'projectID',
};

// Set up BigQuery client and dataset
export const bigqueryClient = new BigQuery(auth);
export const db_dataset = bigqueryClient.dataset('dataset');
