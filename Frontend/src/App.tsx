import React from 'react';
import { UserTable } from './components/UserTable';
import { UserForm } from './components/UserForm';
import { TransactionForm } from './components/TransactionForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">Fraud Detection Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-10">
              <div className="card">
                <div className="p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Create New User</h2>
                  <UserForm />
                </div>
              </div>
              <div className="card">
                <div className="p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Analyze Transaction</h2>
                  <TransactionForm />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">User Management</h2>
                  <UserTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
