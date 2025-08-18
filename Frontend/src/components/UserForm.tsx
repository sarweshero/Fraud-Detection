import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export const UserForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });

  const createUser = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await api.post('/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setFormData({ name: '', email: '', phone_number: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="form-input"
          placeholder="e.g., John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="form-input"
          placeholder="e.g., john.doe@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone_number" className="form-label">
          Phone Number
        </label>
        <input
          id="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={e => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
          className="form-input"
          placeholder="e.g., +1 555-123-4567"
        />
      </div>

      {createUser.isError && (
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
              <p className="text-sm text-red-800">Error adding user. Please try again.</p>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating User...' : 'Create User'}
      </button>
    </form>
  );
};
