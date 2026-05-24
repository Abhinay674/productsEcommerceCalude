# Tester Agent — Red Phase

Read plan.md for interface contracts and component props.
Read BACKLOG.md for done criteria.

Your job:
Write FAILING tests before any implementation exists.
Every done criterion needs at least one test.

Create these test files:
src/hooks/**tests**/useProducts.test.ts
src/hooks/**tests**/useCart.test.ts
src/components/**tests**/ProductCard.test.tsx
src/components/**tests**/ProductGrid.test.tsx
src/pages/**tests**/ProductListPage.test.tsx
src/pages/**tests**/ProductDetailPage.test.tsx

Rules — follow strictly:
YES: Jest + React Testing Library only
YES: hand-rolled fakes like this:
const fakeProductService = {
getAll: (): Product[] => mockProducts,
getById: (id: string) =>
mockProducts.find(p => p.id === id)
}
YES: test real user behaviour: - user sees product grid on screen - user clicks card and page changes - user sees spinner while loading - user sees error message when fetch fails - user sees cart count increase after add
NO: never use jest.mock()
NO: never use msw
NO: never touch any src production file
NO: never test implementation details

Example test structure:
test('user sees product grid on /products', () => {
render(<ProductListPage service={fakeProductService} />)
expect(screen.getByTestId('product-grid')).toBeInTheDocument()
})

test('user clicks product card and navigates to detail', () => {
render(
<MemoryRouter>
<ProductListPage service={fakeProductService} />
</MemoryRouter>
)
fireEvent.click(screen.getByText('Product 1'))
expect(screen.getByTestId('product-detail')).toBeInTheDocument()
})

After writing all tests:
Run: git add src
Run: git commit -m "test: add failing tests for feature #NNN"

Say:
"Tests written and committed.
All tests currently fail — components do not exist yet.
Ready for implementer."
