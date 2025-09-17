-- DROP FUNCTION public.lg_in(int4, varchar, varchar);

CREATE OR REPLACE FUNCTION public.lg_in(p_empresa_id integer, p_login character varying, p_senha character varying)
 RETURNS TABLE(message text, status integer, usuario_id integer, login text, nome_completo text, tipo_usuario text, empresa_id integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
  senha_hash BYTEA;
  senha_hash_hex TEXT;
BEGIN
  -- Gerar hash SHA256 da senha recebida
  senha_hash := digest(p_senha, 'sha256');
  senha_hash_hex := encode(senha_hash, 'hex');

  -- Retornar dados do usuário se login for válido
  RETURN QUERY
  SELECT 
    'Login realizado com sucesso' AS message,
    1 AS status,
    u.id AS usuario_id,
    u.login::TEXT,
    p.nome::TEXT AS nome_completo,
    u.tipo_usuario::TEXT,
    u.empresa_id
  FROM public.usuarios u
  JOIN public.pessoas p ON u.pessoa_id = p.pessoa_id
  WHERE u.login = p_login
    AND u.empresa_id = p_empresa_id
    AND u.senha = senha_hash_hex
    AND u.status_usuario = 1;

  -- Se não encontrar, retorna falha
  IF NOT FOUND THEN
    INSERT INTO public.loginaudit (empresa_id, username, success)
    VALUES (p_empresa_id, p_login, FALSE);

    RETURN QUERY SELECT 'Credenciais inválidas', 0, NULL, NULL, NULL, NULL, NULL;
  ELSE
    INSERT INTO public.loginaudit (empresa_id, username, success)
    VALUES (p_empresa_id, p_login, TRUE);
  END IF;
END;
$function$
;