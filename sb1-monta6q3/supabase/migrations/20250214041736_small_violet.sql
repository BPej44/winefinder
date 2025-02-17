/*
  # Add unique constraint to wine prices

  1. Changes
    - Add unique constraint to wine_prices table to prevent duplicate entries for the same wine and retailer
    - This ensures we only update existing prices rather than creating duplicates

  2. Security
    - No changes to security policies
*/

ALTER TABLE wine_prices
ADD CONSTRAINT wine_prices_wine_id_retailer_key UNIQUE (wine_id, retailer);