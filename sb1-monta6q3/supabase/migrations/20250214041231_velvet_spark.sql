/*
  # Wine Price Aggregator Schema

  1. New Tables
    - `wines`
      - `id` (uuid, primary key)
      - `name` (text)
      - `vintage` (integer)
      - `varietal` (text)
      - `region` (text)
      - `image` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `wine_prices`
      - `id` (uuid, primary key)
      - `wine_id` (uuid, foreign key)
      - `retailer` (text)
      - `price` (decimal)
      - `url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage wines and prices
*/

-- Create wines table
CREATE TABLE IF NOT EXISTS wines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  vintage integer NOT NULL,
  varietal text NOT NULL,
  region text NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wine_prices table
CREATE TABLE IF NOT EXISTS wine_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id uuid REFERENCES wines(id) ON DELETE CASCADE,
  retailer text NOT NULL,
  price decimal(10,2) NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for wines table
CREATE POLICY "Allow public read access for wines"
  ON wines
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage wines"
  ON wines
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for wine_prices table
CREATE POLICY "Allow public read access for wine prices"
  ON wine_prices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage wine prices"
  ON wine_prices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_wines_updated_at
  BEFORE UPDATE ON wines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wine_prices_updated_at
  BEFORE UPDATE ON wine_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();