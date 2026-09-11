# Issue: Habilitar permissão de leitura de estoque na Storefront API (Shopify)

## Contexto
Atualmente, o front-end (loja) está consumindo os produtos, preços e variações da Shopify via Storefront API. No entanto, a quantidade de estoque em tempo real (`quantityAvailable`) não está sendo retornada. Por padrão de segurança, a Shopify oculta essa informação, o que impede a loja de exibir mensagens como "50 em estoque" de forma dinâmica.

Para que a Shopify libere o dado de `quantityAvailable` via Storefront API, é obrigatório declarar o escopo de acesso específico de inventário.

## Tarefa (MCP CLI / Desenvolvedor)
Como o app foi criado e é gerenciado via **Shopify CLI / Dev Dashboard**, as permissões (access scopes) precisam ser atualizadas no arquivo de configuração do app e enviadas para a Shopify.

### Passo a Passo da Implementação:

1. **Acessar o código do App:**
   Navegue até o diretório raiz do repositório do app da Shopify (onde o projeto CLI foi inicializado).

2. **Editar o arquivo de configuração:**
   Localize o arquivo de configuração principal, geralmente chamado `shopify.app.toml` (ou `shopify.app.headless.toml`).

3. **Adicionar o escopo de inventário:**
   Localize a declaração de escopos (scopes) e adicione `unauthenticated_read_product_inventory`. Recomenda-se também garantir o `unauthenticated_read_product_listings`.
   
   *Exemplo de como deve ficar no arquivo TOML:*
   ```toml
   [access_scopes]
   # Mantenha os escopos que já existem e adicione o novo:
   scopes = "..., unauthenticated_read_product_inventory"
   ```

4. **Fazer o Push/Deploy da Configuração:**
   No terminal, autenticado na Shopify CLI, rode o comando para enviar a nova configuração para a nuvem da Shopify:
   ```bash
   npm run shopify app config push
   # ou usando yarn/pnpm dependendo do gerenciador de pacotes
   # ou diretamente: shopify app deploy
   ```

5. **Aceitar os novos termos na Loja (Admin):**
   * Caso a atualização exija re-aprovação, acesse o painel de administrador da loja (`admin.shopify.com`).
   * Vá em **Configurações > Aplicativos e canais de vendas**.
   * Clique no seu aplicativo. Ele provavelmente exibirá um aviso de "Atualização pendente" ou solicitará a aprovação dos novos escopos. Aceite.

## Critério de Aceite (Validação)
Após esses passos, a query GraphQL da Storefront API pedindo o campo `quantityAvailable` dentro do nó de `variants` passará a retornar o valor inteiro real (ex: `50`) em vez de `null`. O front-end React que já está programado reconhecerá automaticamente esse valor e exibirá o estoque na tela.
