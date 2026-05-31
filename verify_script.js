const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to home, add a product to cart
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Agentic_AI/productsEcommerce/frontend/verify_home.png' });
  
  // Click first product card to go to detail
  await page.click('img[alt]');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Agentic_AI/productsEcommerce/frontend/verify_detail.png' });
  
  // Add to cart
  const addBtn = await page.$('button');
  if (addBtn) { await addBtn.click(); }
  await page.waitForTimeout(500);
  
  // Go to cart
  await page.goto('http://localhost:3000/cart');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Agentic_AI/productsEcommerce/frontend/verify_cart.png' });
  
  // Print cart text content
  const cartText = await page.textContent('body');
  console.log('CART_TEXT:', cartText.substring(0, 500));
  
  await browser.close();
})();
