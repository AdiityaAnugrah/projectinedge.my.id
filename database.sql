-- Invoice System Database Schema (Multi-Tenant)
-- Import via phpMyAdmin atau: mysql -u user -p invoice_system < database.sql

CREATE DATABASE IF NOT EXISTS invoice_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE invoice_system;

-- ── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('superadmin','owner') DEFAULT 'owner',
  is_verified TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  verification_token VARCHAR(255),
  verification_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Settings (per owner) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  user_id INT PRIMARY KEY,
  business_name VARCHAR(255) DEFAULT 'Nama Bisnis',
  business_code VARCHAR(20) DEFAULT 'INV',
  logo_data_url LONGTEXT,
  alamat TEXT,
  telepon VARCHAR(50),
  email_bisnis VARCHAR(255),
  whatsapp VARCHAR(50),
  instagram VARCHAR(100),
  facebook VARCHAR(100),
  twitter VARCHAR(100),
  tiktok VARCHAR(100),
  youtube VARCHAR(100),
  linkedin VARCHAR(100),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Invoice Counters (per owner per bulan) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_counters (
  user_id INT NOT NULL,
  month_year VARCHAR(7) NOT NULL COMMENT 'Format: YYYY-MM',
  counter INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, month_year),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Invoices ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  invoice_no VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  notes TEXT,
  grand_total DECIMAL(15,2) DEFAULT 0,
  template TINYINT DEFAULT 1 COMMENT '1-5',
  status ENUM('unpaid','paid') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_invoice_per_user (user_id, invoice_no),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Invoice Items ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  barang VARCHAR(255) NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  harga DECIMAL(15,2) NOT NULL DEFAULT 0,
  total DECIMAL(15,2) GENERATED ALWAYS AS (qty * harga) STORED,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
