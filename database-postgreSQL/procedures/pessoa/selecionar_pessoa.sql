CREATE OR REPLACE PROCEDURE public.selecionar_pessoa(
  IN p_pessoa_id integer DEFAULT NULL,
  IN p_nome varchar(100) DEFAULT NULL,
  IN p_cpf_cnpj varchar(15) DEFAULT NULL,
  IN p_limit integer DEFAULT 10,
  IN p_offset integer DEFAULT 0,
  INOUT resultado refcursor DEFAULT 'resultado_cursor'
)
LANGUAGE plpgsql
AS $$
BEGIN
  OPEN resultado FOR
    SELECT *
    FROM pessoas
    WHERE
      (p_pessoa_id IS NULL OR pessoa_id = p_pessoa_id)
      AND (p_nome IS NULL OR nome ILIKE '%' || p_nome || '%')
      AND (p_cpf_cnpj IS NULL OR cpf_cnpj = p_cpf_cnpj)
    ORDER BY pessoa_id
    LIMIT COALESCE(p_limit, 10)
    OFFSET COALESCE(p_offset, 0);
END;
$$;
