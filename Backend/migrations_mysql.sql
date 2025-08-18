CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  phone_number VARCHAR(64),
  account_status VARCHAR(64) DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DOUBLE NOT NULL,
  timestamp DATETIME NOT NULL,
  location VARCHAR(128),
  payment_method VARCHAR(64),
  status VARCHAR(64),
  fraud_score DOUBLE DEFAULT 0.0,
  decision VARCHAR(64) DEFAULT 'unknown'
);
