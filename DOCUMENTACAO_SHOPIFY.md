# Guia de Organização e Integração Shopify <> Amsterdam Conceito

Este documento serve como base de conhecimento para o futuro. Ele explica como os produtos cadastrados na **Shopify** são mapeados e organizados de forma 100% automatizada no site da **Amsterdam Conceito**.

---

## 1. Como funcionam as Categorias (Feminino, Masculino, Calçados, etc.)
Para que um produto apareça automaticamente em uma categoria específica no menu do site, você precisa configurar um dos seguintes campos no painel da Shopify ao cadastrar/editar o produto:

*   **Tags:** Adicione a tag correspondente (ex: `feminino`, `masculino`, `acessorios`, `calcados`, `esportes`).
*   **Tipo de Produto (Product Type):** Defina o tipo de produto com o nome da categoria.

**Como o site lê isso:** 
Quando o cliente clica na categoria "Acessórios", o site faz uma varredura em milissegundos e puxa qualquer produto que contenha a palavra "Acessório" (ou "acessorios" - o sistema ignora acentos e diferenças entre maiúsculas/minúsculas) no Nome, na Marca, nas Tags ou no Tipo de Produto.

---

## 2. Seção "Mais Vistos" (Carrossel da Página Inicial)
A vitrine principal "Mais Vistos" da página inicial é inteligente e pode ser controlada diretamente pela Shopify:

*   **Padrão (Automático):** Se nenhuma tag especial for encontrada, o site puxará os 8 primeiros produtos disponíveis na loja.
*   **Controle Manual:** Se você quiser destacar produtos específicos (por exemplo, os mais vendidos da semana ou uma nova coleção), basta adicionar **uma destas tags** aos produtos na Shopify:
    *   `tendencia`
    *   `tendências`
    *   `destaque`
    *   `mais-vistos`
    
    *Nota: Assim que o sistema encontrar produtos com essas tags, ele substituirá a vitrine automática exclusivamente por esses itens.*

---

## 3. Categoria de "Ofertas"
O sistema identifica automaticamente quais produtos estão em promoção.
*   Na Shopify, basta preencher o campo **"Preço de comparação"** (Compare at price) com um valor maior que o **"Preço"** (Price) atual.
*   O site calculará o percentual de desconto sozinho, exibirá a tag promocional na foto do produto e o colocará automaticamente na página de Ofertas.

---

## 4. Marcas e Buscas
Se o cliente digitar o nome de uma marca na barra de busca (ex: "Adidas", "Nike", "High"):
*   O site pesquisa diretamente no campo **Vendor (Fornecedor/Marca)** da Shopify.
*   Portanto, garanta que o campo Fornecedor esteja preenchido com a marca real da roupa ao cadastrá-la.

---

## 6. Personalização do Layout e Textos Fixos

Diferente do catálogo de produtos (que vem automaticamente da Shopify), os textos, imagens de fundo, banners e o nome das categorias que aparecem na tela (o "Layout") são editados diretamente no código-fonte do site. 

Isso é feito dessa forma para garantir a máxima performance e que o site carregue muito rápido.

### Como editar algo:
Sempre que você quiser trocar uma frase, um banner promocional ou a imagem principal, basta abrir o arquivo correspondente e trocar o texto ou a URL da imagem.

**Arquivos de layout principais:**
*   **`src/components/Hero.tsx`**: É o grande banner preto da página inicial. Se quiser trocar o texto `"O Seu Estilo, Vista-se de Confiança"` ou a foto da modelo, é só abrir este arquivo e alterar a propriedade `src="url-da-foto"` ou o texto dentro das tags `<h2/>` e `<span/>`.
*   **`src/components/Header.tsx`**: Onde ficam os menus e a barra preta do topo. Se quiser mudar a frase rotativa `"Parcele em até 10x sem juros"`, basta editar o bloco `<div className="flex w-max animate-marquee">` dentro desse arquivo.
*   **`src/components/CategorySlider.tsx`**: É onde estão as bolinhas redondas de "Navegue por Categorias" no celular. Se quiser trocar a foto da bolinha "Feminino", abra este arquivo e mude a propriedade `image` do item correspondente na lista `CATEGORIES`.

**Adicionando uma Nova Categoria no Menu:**
Se você quiser criar uma nova aba no topo do site (ex: "Bolsas"):
1. Abra o arquivo `src/components/Header.tsx`.
2. Encontre a seção `Navigation Categories` (próximo à linha 220).
3. Adicione uma nova linha seguindo o mesmo padrão: `<li><Link to="/categoria/bolsas" className="hover:text-[#C49A6C] transition-colors">Bolsas</Link></li>`.
4. Lembre-se de ir na sua Shopify e colocar a tag `bolsas` nos produtos correspondentes (conforme explicado na Sessão 1) para que eles apareçam quando o cliente clicar!
    
---

## 5. Configuração Técnica (Variáveis de Ambiente)
Para que o site consiga puxar o catálogo e enviar os pedidos para o Checkout da Shopify, as seguintes "Chaves Secretas" devem estar configuradas no ambiente de hospedagem (Settings > Environment Variables):

1.  `VITE_SHOPIFY_STORE_DOMAIN` 
    *   **O que é:** O domínio da sua loja. (ex: `amsterdam-conceito.myshopify.com`)
2.  `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
    *   **O que é:** O token de acesso da Storefront API. 
    *   **Onde gerar:** No painel da Shopify > Configurações > Apps e canais de vendas > Desenvolver apps.

> **Importante:** Nunca coloque essas chaves diretamente no código-fonte por questões de segurança (OWASP). Sempre utilize o gerenciador de variáveis de ambiente do seu servidor/hospedagem.
