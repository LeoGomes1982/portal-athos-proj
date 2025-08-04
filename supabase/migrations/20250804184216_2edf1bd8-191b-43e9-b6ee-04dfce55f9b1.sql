-- Enable Row Level Security on servicos_extras table
ALTER TABLE public.servicos_extras ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view all servicos_extras
CREATE POLICY "Users can view all servicos extras" 
ON public.servicos_extras 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to insert servicos_extras
CREATE POLICY "Users can create servicos extras" 
ON public.servicos_extras 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow authenticated users to update servicos_extras
CREATE POLICY "Users can update servicos extras" 
ON public.servicos_extras 
FOR UPDATE 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to delete servicos_extras
CREATE POLICY "Users can delete servicos extras" 
ON public.servicos_extras 
FOR DELETE 
TO authenticated 
USING (true);