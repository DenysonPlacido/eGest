-- public.permissoes_menu definição

-- Drop table

-- DROP TABLE public.permissoes_menu;

CREATE TABLE public.permissoes_menu (
	id serial4 NOT NULL,
	nome varchar(50) NOT NULL,
	descricao text NULL,
	CONSTRAINT permissoes_menu_pkey PRIMARY KEY (id)
);