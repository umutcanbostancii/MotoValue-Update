-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_calculations_user_id 
    ON public.price_calculations(user_id);

CREATE INDEX IF NOT EXISTS idx_price_calculations_brand_model 
    ON public.price_calculations USING btree (brand, model);

CREATE INDEX IF NOT EXISTS idx_price_calculations_created_at 
    ON public.price_calculations USING btree (created_at DESC); 