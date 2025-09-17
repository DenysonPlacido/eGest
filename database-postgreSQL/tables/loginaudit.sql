-- public.loginaudit definição

-- Drop table

-- DROP TABLE public.loginaudit;

CREATE TABLE public.loginaudit (
	id serial4 NOT NULL,
	empresa_id varchar(50) NOT NULL,
	username varchar(15) NOT NULL,
	success bool NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT loginaudit_pkey PRIMARY KEY (id)
);