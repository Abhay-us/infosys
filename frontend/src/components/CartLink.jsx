import { Link } from "react-router-dom";

function CartLink({ count = 0 }) {
  return (
    <Link className="cart-link" to="/cart" aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}>
      <span className="cart-icon" aria-hidden="true">
        Cart
      </span>
      <span className="cart-count">{count}</span>
    </Link>
  );
}

export default CartLink;
