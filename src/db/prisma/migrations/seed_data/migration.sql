-- 1. Insert Roles with Fixed IDs
INSERT INTO "roles" ("id", "role_name")
VALUES 
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'ADMIN'),
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'CUSTOMER')
ON CONFLICT ("role_name") DO NOTHING;

-- 2. Insert Permissions with Fixed IDs
INSERT INTO "permissions" ("id", "permission_name")
VALUES 
  ('f47ac10b-58cc-4372-a567-0e02b2c3d471', 'add_products'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d472', 'update_products'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d473', 'view_products'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d474', 'view_profile')
ON CONFLICT ("permission_name") DO NOTHING;

-- 3. Insert Admin User with Fixed ID
INSERT INTO "users" ("id", "first_name", "last_name", "email", "updated_at")
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'System', 'Admin', 'admin@example.com', NOW())
ON CONFLICT ("email") DO NOTHING;

-- 4. Role-Permission Links (Standard Access)
INSERT INTO "role_permissions" ("role_id", "permission_id")
VALUES 
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'f47ac10b-58cc-4372-a567-0e02b2c3d471'), -- Admin: add_products
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'f47ac10b-58cc-4372-a567-0e02b2c3d472'), -- Admin: update_products
  ('d290f1ee-6c54-4b01-90e6-d701748f0851', 'f47ac10b-58cc-4372-a567-0e02b2c3d473'), -- Admin: view_products
  ('d290f1ee-6c54-4b01-90e6-d701748f0852', 'f47ac10b-58cc-4372-a567-0e02b2c3d473')  -- Customer: view_products
ON CONFLICT DO NOTHING;

-- 5. User-Role Link (Assign Admin role to User)
INSERT INTO "user_roles" ("user_id", "role_id")
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'd290f1ee-6c54-4b01-90e6-d701748f0851')
ON CONFLICT DO NOTHING;

-- 6. User-Permission Link (Direct Override/Special Access)
INSERT INTO "user_permissions" ("user_id", "permission_id")
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'f47ac10b-58cc-4372-a567-0e02b2c3d474') -- User: view_profile
ON CONFLICT DO NOTHING;