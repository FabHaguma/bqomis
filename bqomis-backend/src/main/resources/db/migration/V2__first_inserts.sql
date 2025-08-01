-- Insert initial roles
INSERT INTO roles (name, description) 
SELECT 'ADMIN', 'Administrator with full access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN')
UNION ALL
SELECT 'STAFF', 'Staff member with limited access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'STAFF')
UNION ALL
SELECT 'CLIENT', 'Client with restricted access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'CLIENT');

-- Insert initial districts
INSERT INTO districts (name, province)
SELECT * FROM (VALUES
('Gasabo', 'Kigali'),
('Kicukiro', 'Kigali'),
('Nyarugenge', 'Kigali'),
('Bugesera', 'East'),
('Gatsibo', 'East'),
('Kayonza', 'East'),
('Kirehe', 'East'),
('Ngoma', 'East'),
('Nyagatare', 'East'),
('Rwamagana', 'East'),
('Burera', 'North'),
('Gakenke', 'North'),
('Gicumbi', 'North'),
('Musanze', 'North'),
('Rulindo', 'North'),
('Gisagara', 'South'),
('Huye', 'South'),
('Kamonyi', 'South'),
('Muhanga', 'South'),
('Nyamagabe', 'South'),
('Nyanza', 'South'),
('Nyaruguru', 'South'),
('Ruhango', 'South'),
('Karongi', 'West'),
('Ngororero', 'West'),
('Nyabihu', 'West'),
('Nyamasheke', 'West'),
('Rubavu', 'West'),
('Rusizi', 'West'),
('Rutsiro', 'West')
) AS new_districts(name, province)
WHERE NOT EXISTS (SELECT 1 FROM districts WHERE districts.name = new_districts.name);

-- Insert initial branches
INSERT INTO branches (name, address, district, province)
SELECT * FROM (VALUES
('BK - Main Branch', 'Chic Building', 'Nyarugenge', 'Kigali'),
('BK - Magerwa Branch', 'Gatenga Sector', 'Gasabo', 'Kigali'),
('BK - Remera Branch', 'Opposite Remera Taxi Park', 'Gasabo', 'Kigali'),
('BK - Nyabugogo Branch', 'Manu Plaza', 'Nyarugenge', 'Kigali'),
('BK - Nyamirambo Branch', 'KN 2 Avenue', 'Nyarugenge', 'Kigali'),
('BK - RDB Branch', 'RDB Building, Gishushu', 'Gasabo', 'Kigali'),
('BK - Premier Branch', 'Diamond House', 'Gasabo', 'Kigali'),
('BK - Airport Branch', 'KN 5 Road', 'Gasabo', 'Kigali'),
('BK - CBE Branch', 'KK 737 Street', 'Gasabo', 'Kigali'),
('BK - Nyamata Branch', 'Nyamata', 'Bugesera', 'Eastern'),
('BK - Musanze Branch', 'Musanze', 'Musanze', 'Northern'),
('BK - Gicumbi Branch', 'Gatuna BP 175', 'Gicumbi', 'Northern'),
('BK - Burera Branch', 'Butaro', 'Burera', 'Northern'),
('BK - Gakenke Branch', 'Gakenke BP 175', 'Gakenke', 'Northern'),
('BK - Rusizi Branch', 'Bugarama', 'Rusizi', 'Western'),
('BK - Nyamasheke Branch', 'Nyamasheke', 'Nyamasheke', 'Western'),
('BK - Karongi Branch', 'BP 175 Karongi', 'Karongi', 'Western'),
('BK - Rubavu Branch', 'Ruhengeri-Gisenyi Road', 'Rubavu', 'Western')
) AS new_branches(name, address, district, province)
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE branches.name = new_branches.name);

-- Insert initial services
INSERT INTO services (name, description)
SELECT * FROM (VALUES
('Withdraw', 'Service to withdraw money from your account'),
('Deposit', 'Service to deposit money into your account'),
('Check Book', 'Service to request a new check book'),
('Foreign Currency', 'Service to exchange foreign currency'),
('Loan Application', 'Service to apply for a loan'),
('Account Opening', 'Service to open a new bank account'),
('Balance Inquiry', 'Service to check your account balance'),
('Card Replacement', 'Service to replace a lost or damaged card'),
('Bill Payment', 'Service to pay your bills conveniently'),
('Money Transfer', 'Service to transfer money to another account'),
('Fixed Deposit', 'Service to create a fixed deposit account'),
('Investment Services', 'Service to explore and manage investment options')
) AS new_services(name, description)
WHERE NOT EXISTS (SELECT 1 FROM services WHERE services.name = new_services.name);
