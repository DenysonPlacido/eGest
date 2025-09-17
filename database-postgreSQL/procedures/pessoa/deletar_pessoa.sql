CREATE OR REPLACE PROCEDURE public.deletar_pessoa(
  IN p_pessoa_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pessoas WHERE pessoa_id = p_pessoa_id) THEN
    DELETE FROM pessoas WHERE pessoa_id = p_pessoa_id;
    RAISE NOTICE '✅ Pessoa com ID % deletada com sucesso.', p_pessoa_id;
  ELSE
    RAISE EXCEPTION '⚠️ Pessoa com ID % não encontrada para exclusão.', p_pessoa_id;
  END IF;
END;
$$;
