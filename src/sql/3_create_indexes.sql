-- 3. Create indexes for better performance

-- ============================================================================
-- PRICE_CALCULATIONS TABLE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_price_calculations_user_id 
    ON public.price_calculations(user_id);

CREATE INDEX IF NOT EXISTS idx_price_calculations_brand_model 
    ON public.price_calculations USING btree (brand, model);

CREATE INDEX IF NOT EXISTS idx_price_calculations_created_at 
    ON public.price_calculations USING btree (created_at DESC);

-- ============================================================================
-- MOTORCYCLES TABLE INDEXES - Critical Performance Improvement
-- ============================================================================

-- Primary brand lookup - fetchBrands() optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motorcycles_brand 
    ON motorcycles (brand ASC);

-- Brand-Model composite - handleBrandSelect() optimization  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motorcycles_brand_model 
    ON motorcycles (brand ASC, model ASC);

-- Covering index for price calculations - handleCalculatePrice() optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_motorcycles_calculation_covering 
    ON motorcycles (brand, model) 
    INCLUDE (id, year, price); 