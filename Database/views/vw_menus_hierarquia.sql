-- public.vw_menus_hierarquia fonte

CREATE OR REPLACE VIEW public.vw_menus_hierarquia
AS WITH RECURSIVE menu_tree AS (
         SELECT menus_sistema.id,
            menus_sistema.nome,
            menus_sistema.descricao,
            menus_sistema.tipo,
            menus_sistema.hierarquia_pai,
            menus_sistema.caminho,
            menus_sistema.ordem,
            menus_sistema.icone,
            menus_sistema.permissao,
            menus_sistema.modulo,
            menus_sistema.ativo,
            menus_sistema.data_criacao,
            menus_sistema.data_atualizacao,
            menus_sistema.nome::text AS caminho_hierarquico,
            1 AS nivel
           FROM menus_sistema
          WHERE menus_sistema.hierarquia_pai IS NULL
        UNION ALL
         SELECT m.id,
            m.nome,
            m.descricao,
            m.tipo,
            m.hierarquia_pai,
            m.caminho,
            m.ordem,
            m.icone,
            m.permissao,
            m.modulo,
            m.ativo,
            m.data_criacao,
            m.data_atualizacao,
            (mt.caminho_hierarquico || ' > '::text) || m.nome::text,
            mt.nivel + 1
           FROM menus_sistema m
             JOIN menu_tree mt ON m.hierarquia_pai = mt.id
        )
 SELECT id,
    nome,
    descricao,
    tipo,
    hierarquia_pai,
    caminho,
    ordem,
    icone,
    permissao,
    modulo,
    ativo,
    data_criacao,
    data_atualizacao,
    caminho_hierarquico,
    nivel
   FROM menu_tree
  ORDER BY caminho_hierarquico;