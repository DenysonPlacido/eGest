-- public.usuario_perfil definição

-- Drop table

-- DROP TABLE public.usuario_perfil;

CREATE TABLE public.usuario_perfil (
	id serial4 NOT NULL,
	usuario_id int4 NULL,
	perfil_id int4 NULL,
	CONSTRAINT usuario_perfil_pkey PRIMARY KEY (id)
);


-- public.usuario_perfil chaves estrangeiras

ALTER TABLE public.usuario_perfil ADD CONSTRAINT usuario_perfil_perfil_id_fkey FOREIGN KEY (perfil_id) REFERENCES public.perfis(id) ON DELETE CASCADE;
ALTER TABLE public.usuario_perfil ADD CONSTRAINT usuario_perfil_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;