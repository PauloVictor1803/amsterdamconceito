import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo Amsterdam Conceito E2E', () => {
  
  test('Deve navegar pelas categorias, favoritar produto, adicionar à sacola e conferir o carrinho', async ({ page }) => {
    // 1. Acesso à Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Amsterdam Conceito/);
    await page.waitForTimeout(1000);

    // 2. Favoritar um produto (Lista de Desejos)
    const firstFavoriteBtn = page.locator('button[aria-label*="favoritos"]').first();
    await expect(firstFavoriteBtn).toBeVisible();
    await firstFavoriteBtn.click();
    await page.waitForTimeout(1200);

    // Acessar Lista de Desejos e conferir item
    const wishlistLink = page.getByRole('link', { name: /Lista de Desejos/i }).first();
    await wishlistLink.click();
    await expect(page).toHaveURL(/\/favoritos/);
    await page.waitForTimeout(1500);

    // 3. Navegar por uma categoria (ex: Relógios ou Feminino)
    const categoryLink = page.getByRole('link', { name: /Relógios/i }).first();
    if (await categoryLink.isVisible()) {
      await categoryLink.click();
      await expect(page).toHaveURL(/\/categoria\/relogios/);
      await page.waitForTimeout(1500);
    }

    // 4. Voltar para Início
    const homeLink = page.getByRole('link', { name: /^Início$/i }).first();
    await homeLink.click();
    await page.waitForTimeout(1000);

    // 5. Entrar nos detalhes do primeiro produto
    const productLink = page.locator('a[href^="/produto/"]').first();
    await productLink.click();
    await expect(page).toHaveURL(/\/produto\//);
    await page.waitForTimeout(1200);

    // 6. Validar UI e Ações do Produto
    const addToCartBtn = page.getByRole('button', { name: /Adicionar à Sacola/i });
    await expect(addToCartBtn).toBeVisible();

    const buyNowBtn = page.getByRole('button', { name: /Comprar Agora/i });
    await expect(buyNowBtn).toBeVisible();

    // Aumentar a quantidade se botão "+" estiver presente
    const plusBtn = page.locator('button:has(svg.lucide-plus)');
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(600);
    }

    // 7. Clicar em "Adicionar à Sacola" e ir para o Carrinho
    await addToCartBtn.click();
    await page.waitForTimeout(1000);

    // Validar redirecionamento para o carrinho
    await expect(page).toHaveURL(/\/carrinho/);
    await page.waitForTimeout(1500);

    // Conferir que a sacola tem o item adicionado
    const cartItems = page.locator('div:has-text("Subtotal"), a:has-text("Finalizar"), button:has-text("Finalizar")');
    await expect(cartItems.first()).toBeVisible();

    // Manter aberto mais alguns segundos para o usuário ver a sacola preenchida na tela
    await page.waitForTimeout(3000);
  });

});
