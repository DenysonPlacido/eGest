CREATE OR REPLACE PROCEDURE deletar_usuario(
    p_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM usuarios WHERE id = p_id) THEN
        DELETE FROM usuarios WHERE id = p_id;
        RAISE NOTICE '🗑️ Usuário ID % deletado com sucesso.', p_id;
    ELSE
        RAISE NOTICE '⚠️ Usuário ID % não encontrado.', p_id;
    END IF;
END;
$$;
