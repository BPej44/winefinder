/*
  # Add Sample Wine Data

  1. Sample Data
    - Add three initial wines with their prices
    - Include data from popular Australian wineries
    - Add realistic pricing from different retailers

  2. Data Structure
    - First insert wines
    - Then insert corresponding prices
*/

-- Insert sample wines
INSERT INTO wines (id, name, vintage, varietal, region, image)
VALUES
  (
    'e8dd77c4-9c42-4a24-a654-4e13c5d8d607',
    'Penfolds Bin 389 Cabernet Shiraz',
    2020,
    'Cabernet-Shiraz Blend',
    'South Australia',
    'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'f7b95c2a-8139-4e66-b89c-1a1e6d8e6d24',
    'Leeuwin Estate Art Series Chardonnay',
    2019,
    'Chardonnay',
    'Margaret River',
    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'c5d9a4b3-7e62-4f88-9d2c-3b7e8f5d4e1a',
    'Henschke Hill of Grace',
    2017,
    'Shiraz',
    'Eden Valley',
    'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80'
  );

-- Insert sample prices
INSERT INTO wine_prices (wine_id, retailer, price, url)
VALUES
  -- Penfolds Bin 389
  (
    'e8dd77c4-9c42-4a24-a654-4e13c5d8d607',
    'Dan Murphy''s',
    100.00,
    'https://www.danmurphys.com.au/product/penfolds-bin-389'
  ),
  (
    'e8dd77c4-9c42-4a24-a654-4e13c5d8d607',
    'Vintage Cellars',
    105.00,
    'https://www.vintagecellars.com.au/product/penfolds-bin-389'
  ),
  (
    'e8dd77c4-9c42-4a24-a654-4e13c5d8d607',
    'Wine House',
    95.00,
    'https://www.winehouse.com.au/product/penfolds-bin-389'
  ),

  -- Leeuwin Estate
  (
    'f7b95c2a-8139-4e66-b89c-1a1e6d8e6d24',
    'Dan Murphy''s',
    120.00,
    'https://www.danmurphys.com.au/product/leeuwin-estate-art-series'
  ),
  (
    'f7b95c2a-8139-4e66-b89c-1a1e6d8e6d24',
    'First Choice',
    115.00,
    'https://www.firstchoice.com.au/product/leeuwin-estate-art-series'
  ),
  (
    'f7b95c2a-8139-4e66-b89c-1a1e6d8e6d24',
    'Wine House',
    125.00,
    'https://www.winehouse.com.au/product/leeuwin-estate-art-series'
  ),

  -- Henschke Hill of Grace
  (
    'c5d9a4b3-7e62-4f88-9d2c-3b7e8f5d4e1a',
    'Dan Murphy''s',
    890.00,
    'https://www.danmurphys.com.au/product/henschke-hill-of-grace'
  ),
  (
    'c5d9a4b3-7e62-4f88-9d2c-3b7e8f5d4e1a',
    'Vintage Cellars',
    895.00,
    'https://www.vintagecellars.com.au/product/henschke-hill-of-grace'
  ),
  (
    'c5d9a4b3-7e62-4f88-9d2c-3b7e8f5d4e1a',
    'Wine House',
    885.00,
    'https://www.winehouse.com.au/product/henschke-hill-of-grace'
  );