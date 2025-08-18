import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

export const TransactionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    location: '',
    payment_method: ''
  });

  const [result, setResult] = useState<{ fraud_score: number; decision: string } | null>(null);

  const scoreTransaction = useMutation({
    mutationFn: async (transactionData: any) => {
      const response = await api.post('/score', {
        ...transactionData,
        user_id: parseInt(transactionData.user_id),
        amount: parseFloat(transactionData.amount),
        timestamp: new Date().toISOString(),
        status: 'completed', // Added default status
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResult(data);
      setFormData({ user_id: '', amount: '', location: '', payment_method: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scoreTransaction.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="user_id" className="form-label">
          User ID
        </label>
        <input
          id="user_id"
          type="number"
          value={formData.user_id}
          onChange={e => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
          className="form-input"
          placeholder="e.g., 101"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="form-input"
          placeholder="e.g., 99.99"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="form-input"
          placeholder="e.g., New York, NY"
          required
        />
      </div>

      <div>
        <label htmlFor="payment_method" className="form-label">
          Payment Method
        </label>
        <select
          id="payment_method"
          value={formData.payment_method}
          onChange={e => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
          className="form-input"
          required
        >
          <option value="">Select a method</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="digital_wallet">Digital Wallet</option>
        </select>
      </div>

      {scoreTransaction.isError && (
        <div className="rounded-md bg-red-100 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                {scoreTransaction.error instanceof Error
                  ? scoreTransaction.error.message
                  : 'An unknown error occurred.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div
          className={`rounded-lg p-6 text-center transition-all duration-300 ${
            result.decision === 'Approve'
              ? 'bg-green-100'
              : result.decision === 'Review'
              ? 'bg-yellow-100'
              : 'bg-red-100'
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-2 ${
              result.decision === 'Approve'
                ? 'text-green-900'
                : result.decision === 'Review'
                ? 'text-yellow-900'
                : 'text-red-900'
            }`}
          >
            Transaction Analysis Result
          </h3>
          <p
            className={`text-5xl font-bold tracking-tight ${
              result.decision === 'Approve'
                ? 'text-green-600'
                : result.decision === 'Review'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {result.decision}
          </p>
          <p
            className={`mt-2 text-sm ${
              result.decision === 'Approve'
                ? 'text-green-800'
                : result.decision === 'Review'
                ? 'text-yellow-800'
                : 'text-red-800'
            }`}
          >
            Fraud Score: <strong>{result.fraud_score.toFixed(4)}</strong>
          </p>
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={scoreTransaction.isPending}>
        {scoreTransaction.isPending ? 'Analyzing...' : 'Analyze Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
