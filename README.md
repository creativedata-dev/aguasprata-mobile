```markdown
# ÁguasPrata - Mobile (Expo) + Serverless Proxy (Vercel)

Esqueleto inicial do app mobile React Native (Expo) para a store `aguasprata` no ambiente commercesta

## Estrutura
- App (Expo / TypeScript) em `./` com fontes em `src/`
- Função serverless (Vercel) em `./vercel-serverless/api/create-order.js`

## Setup local (app)
1. Instale as dependências:
   npm install

2. Configurar PROXY_BASE no app:
   - No Expo, você pode passar variáveis extras em `app.json`/`app.config.js` ou em runtime usando Constants.
   - Exemplo (app.json extras):
     {
       "expo": {
         ...,
         "extra": {
           "PROXY_BASE": "https://YOUR_VERCEL_URL.vercel.app/api"
         }
       }
     }

3. Rode:
   npm run start

## Setup e deploy do proxy (Vercel)
1. Crie um projeto no Vercel e aponte o diretório `vercel-serverless` (ou apenas suba o arquivo `vercel-serverless/api/create-order.js` dentro de um projeto).
2. Configure as variáveis de ambiente no Vercel:
   - VTEX_APP_KEY (AppKey)
   - VTEX_APP_TOKEN (AppToken)
   - VTEX_ACCOUNT (opcional, default: aguasprata)

3. Faça deploy. O endpoint resultante será algo como:
   https://your-vercel-project.vercel.app/api/create-order

4. Configure PROXY_BASE no app para apontar para `https://your-vercel-project.vercel.app/api`.

## Observações e próximos passos
- Nunca coloque AppKey/AppToken no app cliente.
- A função serverless acima é um exemplo mínimo. Em produção:
  - Valide e normalize payloads (siga o schema do Checkout VTEX).
  - Autentique chamadas do app ao proxy (ex.: JWT, API key) para evitar uso indevido.
  - Trate erros da VTEX e retorne códigos apropriados.
- Melhorias: autenticação VTEX ID, cálculo de frete, lista de endereços do usuário, integração com gateway e 3DS, testes e CI.

```