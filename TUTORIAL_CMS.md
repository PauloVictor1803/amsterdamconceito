# Guia do CMS: Como Editar os Textos do Site

Este documento serve como referência rápida para **nós (desenvolvedores)** e como um **tutorial passo a passo para o cliente final** sobre como alterar os textos dinâmicos do site da Amsterdam Conceito diretamente pela Shopify.

---

## Parte 1: Para o Cliente Final (Tutorial Passo a Passo)

Alterar os textos, preços promocionais e endereços do seu site é muito fácil e você não precisa saber programação. Tudo é feito pelo painel que você já conhece na Shopify.

### Como editar qualquer texto do site:

1. **Faça login** no seu painel da Shopify.
2. Olhe para o menu escuro do lado esquerdo.
3. Clique em **Conteúdo** (fica logo abaixo de Clientes e Produtos).
4. Em seguida, clique em **Metaobjetos**.
5. Na tela que abrir, no quadro de "Entradas recentes", você verá uma entrada chamada **Geral** com o tipo **Configuracoes Loja**. Clique na palavra **Geral**.
6. Agora você está na tela de edição! Todos os textos do seu site estão aqui. 
7. **Basta apagar o texto antigo e digitar o texto novo**. 
8. Após alterar o que deseja, clique no botão preto **Salvar** (no topo ou no rodapé da página).
9. **Pronto!** Vá no seu site, atualize a página (F5) e veja as mudanças ao vivo.

> **Dicas de Ouro:**
> - Se quiser que um texto pule de linha, escreva `<br/>` no meio dele. Exemplo: `O SEU<br/>ESTILO`.
> - Na hora de colocar a imagem principal do topo, procure o campo **Hero Image** lá no final, clique no botão e faça o upload da sua nova foto.

---

## Parte 2: Para a Equipe de Desenvolvimento (Referência Técnica)

Abaixo está o mapeamento completo de qual Chave (`Key`) da API corresponde a qual parte visual do site. O site utiliza o componente React `<EditableText />` para consumir esses dados em tempo real da Storefront API.

### 🔝 Banner Principal (Topo)
- `texto_banner_principal_titulo` ➔ Título grande branco (H1).
- `texto_banner_principal_subtitulo` ➔ Subtítulo cinza claro (H2).
- `texto_banner_principal_destaque` ➔ Palavra com a cor dourada de destaque.
- `texto_banner_principal_botao` ➔ Texto do botão CTA principal.
- `hero_image` ➔ Arquivo da imagem de fundo do painel.

### 🛍️ Categorias e Faixa de Preços (Meio)

**Imagens das 7 Categorias (Opcional)**
As 7 categorias e seus links já vêm prontos e vinculados automaticamente às tags dos produtos no Shopify. Se a loja quiser trocar a foto de qualquer uma das bolinhas, basta adicionar o campo do tipo **Arquivo** correspondente:

- `categoria_1_imagem` (ou `categoria_ofertas_imagem`) ➔ Imagem para **Ofertas**
- `categoria_2_imagem` (ou `categoria_feminino_imagem`) ➔ Imagem para **Feminino**
- `categoria_3_imagem` (ou `categoria_masculino_imagem`) ➔ Imagem para **Masculino**
- `categoria_4_imagem` (ou `categoria_relogios_imagem`) ➔ Imagem para **Relógios**
- `categoria_5_imagem` (ou `categoria_oculos_imagem`) ➔ Imagem para **Óculos**
- `categoria_6_imagem` (ou `categoria_acessorios_imagem`) ➔ Imagem para **Acessórios**
- `categoria_7_imagem` (ou `categoria_bones_imagem`) ➔ Imagem para **Bonés**

*(Se o campo estiver vazio, o site usa a imagem padrão linda que já está nele. Não precisa configurar links nem nomes!)*

**Faixa de Preços e Banner**
- `botao_preco_1` ➔ Primeiro botão da faixa de ofertas (Ex: "A PARTIR DE R$ 19,99").
- `botao_preco_2` ➔ Segundo botão da faixa de ofertas.
- `botao_preco_3` ➔ Terceiro botão da faixa de ofertas.
- `botao_preco_4` ➔ Quarto botão da faixa de ofertas.
- `texto_banner_traga_seu_estilo` ➔ Título grande do banner escuro intermediário.

### 👣 Rodapé (Footer)
- `rodape_frase_slogan` ➔ Slogan em itálico abaixo do logo do rodapé.
- `rodape_horario_semana` ➔ Horário de Funcionamento (Seg-Sex).
- `rodape_horario_sabado` ➔ Horário de Funcionamento (Sábado).
- `rodape_horario_domingo` ➔ Horário de Funcionamento (Domingo).

### 📍 Informações das Lojas Físicas e WhatsApp
**(Unidade 1 - Matriz / Delfino)**
- `rodape_loja_1_nome` ➔ Nome da unidade 1 no rodapé e no popup do WhatsApp.
- `rodape_loja_1_endereco` ➔ Endereço físico completo da loja 1.
- `rodape_loja_1_telefone` ➔ Telefone exibido no rodapé para a loja 1.
- `rodape_loja_1_link_mapa` ➔ (Opcional) Link do Google Maps da loja 1 (ex: URL completa para a localização da loja).
- `whatsapp_loja_1_nome` ➔ Nome do atendente no popup flutuante do Wpp.
- `whatsapp_loja_1_numero` ➔ Número formatado mostrado no popup flutuante.

**(Unidade 2 - Filial / Santos Reis)**
- `rodape_loja_2_nome` ➔ Nome da unidade 2 no rodapé e no popup do WhatsApp.
- `rodape_loja_2_endereco` ➔ Endereço físico completo da loja 2.
- `rodape_loja_2_telefone` ➔ Telefone exibido no rodapé para a loja 2.
- `rodape_loja_2_link_mapa` ➔ (Opcional) Link do Google Maps da loja 2 (ex: URL completa para a localização da loja).
- `whatsapp_loja_2_nome` ➔ Nome do atendente no popup flutuante do Wpp.
- `whatsapp_loja_2_numero` ➔ Número formatado mostrado no popup flutuante.
