--Insert Tony Stark record
INSERT INTO account (
	account_firstname, 
	account_lastname, 
	account_email,
	account_password
) VALUES (
	'Tony', 
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

--Edit account_type
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM account
WHERE account_id = 1;


--Edit GC Hummer 'small interiors'
UPDATE public.inventory
SET inv_description = REPLACE(
	inv_description,
	'small interiors',
	'a huge interior'
	)
WHERE inv_id = 10;


-- make and model fields from the inventory table 
-- and the classification name field from the classification 
-- table for inventory items that belong to the "Sport" category
SELECT
	inv_make,
	inv_model,
	classification_name
FROM
	public.inventory
INNER JOIN public.classification
	ON inventory.classification_id = classification.classification_name
WHERE
	classification.classification_id = 2;
	
--Update image paths from /images to /images/vehicles
UPDATE public.inventory
SET 
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')
	
