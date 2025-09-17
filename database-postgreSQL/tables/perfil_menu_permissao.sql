-- public.perfil_menu_permissao definição

-- Drop table

-- DROP TABLE public.perfil_menu_permissao;

CREATE TABLE public.perfil_menu_permissao (
	id serial4 NOT NULL,
	perfil_id int4 NULL,
	menu_id int4 NULL,
	permissao_id int4 NULL,
	ativo bool DEFAULT true NULL,
	CONSTRAINT perfil_menu_permissao_pkey PRIMARY KEY (id)
);


-- public.perfil_menu_permissao chaves estrangeiras

ALTER TABLE public.perfil_menu_permissao ADD CONSTRAINT perfil_menu_permissao_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.menus_sistema(id) ON DELETE CASCADE;
ALTER TABLE public.perfil_menu_permissao ADD CONSTRAINT perfil_menu_permissao_perfil_id_fkey FOREIGN KEY (perfil_id) REFERENCES public.perfis(id) ON DELETE CASCADE;
ALTER TABLE public.perfil_menu_permissao ADD CONSTRAINT perfil_menu_permissao_permissao_id_fkey FOREIGN KEY (permissao_id) REFERENCES public.permissoes_menu(id) ON DELETE CASCADE;

