-- Add a test staff member with today's birthday
-- This will be automatically set to today's date

-- Get today's month and day
DO $$
DECLARE
    today_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
    today_day INTEGER := EXTRACT(DAY FROM CURRENT_DATE);
BEGIN
    -- Insert test staff member with today's birthday
    INSERT INTO public.staff_members (name, birthday_month, birthday_day) 
    VALUES ('Test Birthday Person', today_month, today_day)
    ON CONFLICT DO NOTHING;
    
    -- Add a sample birthday message for the test person
    INSERT INTO public.birthday_messages (staff_member_id, sender_name, message)
    SELECT 
        sm.id,
        'Welcome Team',
        'Happy Birthday! 🎉 This is a test message to show how the birthday board works. Hope you have an amazing day filled with joy and celebration! 🎂🎈'
    FROM public.staff_members sm 
    WHERE sm.name = 'Test Birthday Person' 
    AND sm.birthday_month = today_month 
    AND sm.birthday_day = today_day
    ON CONFLICT DO NOTHING;
    
    -- Add another sample message
    INSERT INTO public.birthday_messages (staff_member_id, sender_name, message)
    SELECT 
        sm.id,
        'Birthday Bot',
        'Wishing you all the best on your special day! May this year bring you happiness, success, and lots of cake! 🍰✨'
    FROM public.staff_members sm 
    WHERE sm.name = 'Test Birthday Person' 
    AND sm.birthday_month = today_month 
    AND sm.birthday_day = today_day
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Test birthday person added for today (%-%) with sample messages!', today_month, today_day;
END $$;
