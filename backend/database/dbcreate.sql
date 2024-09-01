-- Create the Products table
CREATE TABLE Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unit_price REAL NOT NULL
);

-- Create the Factures table
CREATE TABLE Factures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    total_price REAL NOT NULL
);

-- Create the FactureProducts table
CREATE TABLE FactureProducts (
    facture_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (facture_id) REFERENCES Factures(id),
    FOREIGN KEY (product_id) REFERENCES Products(id),
    PRIMARY KEY (facture_id, product_id)
);
