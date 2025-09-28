-- insere o nodulo especifico no perfil novo

INSERT INTO public.perfil_menu_permissao
    (id, perfil_id, menu_id, ativo, versao_registro, data_inclusao, usuario_inclusao, data_alteracao, usuario_alteracao)
SELECT 
    nextval('perfil_menu_permissao_id_seq'::regclass), -- gera novo id
    2,                                                -- perfil_id fixo
    ms.id,                                            -- menu_id vindo da query
    true,                                             -- ativo
    0,                                                -- versao_registro
    CURRENT_TIMESTAMP,                                -- data_inclusao
    '',                                               -- usuario_inclusao
    CURRENT_TIMESTAMP,                                -- data_alteracao
    ''                                                -- usuario_alteracao
FROM menus_sistema ms
WHERE ms.caminho LIKE '/cadastro%'
   OR ms.caminho LIKE '/comunicacao%'
   OR ms.caminho LIKE '/configuracao%'
   OR ms.caminho LIKE '/sobre%'
   OR ms.caminho LIKE '/gestao'
   OR ms.caminho LIKE '/gestao/dispensa%'
ORDER BY ms.ordem;