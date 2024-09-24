// authHelpers.ts

/**
 * Função para verificar se o token está expirado.
 * @param token O token de acesso a ser verificado.
 * @returns True se o token estiver expirado, false caso contrário.
 */
function isTokenExpired(token: string): boolean {
  // Decodifique o token (se for um JWT) e verifique o campo 'exp'
  // Este é um exemplo simplificado; você precisará ajustar de acordo com seu token
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiration = payload.exp;
  const now = Math.floor(Date.now() / 1000);

  return expiration < now;
}

export async function getAuthToken(): Promise<string | null> {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  } else {
    // Opcional: tentar renovar o token usando um refresh token
    // Ou redirecionar o usuário para a tela de login
    return null;
  }
}
