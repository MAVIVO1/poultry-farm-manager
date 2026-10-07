import { useEffect, useState } from "react";
import { getProducts, checkout } from "./api";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  function addToCart(productId) {
    setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + 1 }));
  }

  function removeFromCart(productId) {
    setCart((c) => {
      const next = { ...c };
      if (next[productId] > 1) next[productId] -= 1;
      else delete next[productId];
      return next;
    });
  }

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === Number(productId));
    return { product, quantity };
  });
  const total = cartItems.reduce((sum, { product, quantity }) => sum + (product?.priceETB || 0) * quantity, 0);

  async function handleCheckout() {
    setMessage("");
    try {
      const items = Object.entries(cart).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
      }));
      const order = await checkout(items);
      setMessage(`Order #${order.orderId} placed — ETB ${order.totalETB} (cash on delivery).`);
      setCart({});
      getProducts().then(setProducts);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <h2 style={{ color: "#e9c46a" }}>Farm Shop</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <p>ETB {p.priceETB} / {p.unit}</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>In stock: {p.stockQuantity}</p>
            <button className="primary" onClick={() => addToCart(p.id)}>Add to cart</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Cart</h3>
        {cartItems.length === 0 && <p style={{ opacity: 0.7 }}>Your cart is empty.</p>}
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>{product.name} × {quantity}</span>
            <span>
              ETB {product.priceETB * quantity}{" "}
              <button className="primary" onClick={() => removeFromCart(product.id)} style={{ marginLeft: 8 }}>-</button>
              <button className="primary" onClick={() => addToCart(product.id)} style={{ marginLeft: 4 }}>+</button>
            </span>
          </div>
        ))}
        {cartItems.length > 0 && (
          <>
            <p style={{ fontWeight: 700 }}>Total: ETB {total} (Cash on Delivery)</p>
            <button className="primary" onClick={handleCheckout}>Checkout</button>
          </>
        )}
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}
