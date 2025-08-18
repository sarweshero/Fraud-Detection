import axios from 'axios';
export const api = axios.create({ baseURL: 'http://localhost:8000' });

export type User = {
  user_id: number;
  name: string;
  email: string;
  phone_number?: string;
  account_status: string;
  created_at: string;
  last_login?: string;
};

export type ScoreOutput = {
  transaction_id: number;
  fraud_score: number;
  decision: string;
  threshold_used: number;
};
