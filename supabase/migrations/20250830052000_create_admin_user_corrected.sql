INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, email_change, email_change_sent_at, phone, phone_confirmed_at, is_sso_user) VALUES
('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'authenticated', 'authenticated', 'admin@example.com', crypt('password', gen_salt('bf')), NOW(), '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{}', '', '', NULL, NULL, NULL, false);

INSERT INTO public.profiles (user_id, display_name, email, role) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin', 'admin@example.com', 'admin');
