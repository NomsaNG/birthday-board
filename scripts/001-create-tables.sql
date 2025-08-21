-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create staff members table
CREATE TABLE IF NOT EXISTS public.staff_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birthday_month INTEGER NOT NULL CHECK (birthday_month >= 1 AND birthday_month <= 12),
  birthday_day INTEGER NOT NULL CHECK (birthday_day >= 1 AND birthday_day <= 31),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create birthday messages table
CREATE TABLE IF NOT EXISTS public.birthday_messages (
  id SERIAL PRIMARY KEY,
  staff_member_id INTEGER REFERENCES public.staff_members(id) ON DELETE CASCADE,
  sender_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_messages ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access on staff_members" ON public.staff_members
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on birthday_messages" ON public.birthday_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on birthday_messages" ON public.birthday_messages
  FOR INSERT WITH CHECK (true);

-- Clear existing data and insert fresh staff members data
DELETE FROM public.staff_members;

-- Insert staff members data
INSERT INTO public.staff_members (name, birthday_month, birthday_day) VALUES
('Stanley', 1, 4),
('Timna', 1, 13),
('Anton', 1, 13),
('Nomsa', 1, 17),
('Kaele', 1, 22),
('Bongani', 1, 24),
('Peter', 1, 26),
('Dave', 1, 29),
('Carla', 2, 11),
('Robin', 2, 25),
('Stephan', 2, 27),
('Roudah', 3, 1)
('Octavio', 3, 3),
('Ibtishaam', 3, 4),
('Warren', 3, 8),
('Zoe', 3, 11),
('Portia', 3, 14),
('Shelly', 3, 28),
('Kaylene', 3, 29),
('Boitumelo', 4, 6),
('De Wet', 4, 20),
('Christian', 4, 29),
('Yumnah', 5, 5)
('Johan', 5, 24),
('Sonwabile', 6, 6),
('Patience', 6, 7),
('Mendy', 6, 14),
('San-Marie', 6, 25),
('Monalisa', 6, 30),
('Jean', 7, 3),
('Senelisiwe', 7, 19)
('Theresa', 8, 5),
('Nkeletseng', 8, 11),
('Sithembile', 8, 18),
('Darren', 8, 31),
('Nicholas', 9, 18),
('Jamie', 9, 20),
('Chloe', 9, 21),
('Irfaan', 11, 11),
('Simon', 12, 15),
('JG', 12, 16),
('Tristen', 12, 19),
('Zimbini', 12, 26);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_birthday ON public.staff_members(birthday_month, birthday_day);
CREATE INDEX IF NOT EXISTS idx_messages_staff ON public.birthday_messages(staff_member_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.birthday_messages(created_at DESC);
