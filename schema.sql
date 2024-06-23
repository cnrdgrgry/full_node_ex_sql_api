CREATE TABLE pastries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  primary_flavour TEXT NOT NULL,
  country_of_origin TEXT NOT NULL,
  price REAL NOT NULL
);

INSERT INTO pastries (name, primary_flavour, country_of_origin, price) 
VALUES
('Cinnamon Snail', 'Cinnamon', 'Denmark', 2.5),
('Croissant', 'Buttery', 'France', 1.8),
('Eccles Cake', 'Currant-filled', 'United Kingdom', 1.7),
('Cannoli', 'Sweet ricotta cheese', 'Italy', 2.2),
('Baklava', 'Honey and nuts', 'Turkey', 2.3),
('Pain au Chocolat', 'Chocolate', 'France', 2.0),
('Stollen', 'Fruit and marzipan', 'Germany', 3.0),
('Pastel de Nata', 'Custard', 'Portugal', 1.6),
('Sachertorte', 'Chocolate and apricot', 'Austria', 4.0),
('Madeleine', 'Lemon', 'France', 1.2),
('Sticky Toffee Pudding', 'Date and toffee', 'United Kingdom', 3.5);