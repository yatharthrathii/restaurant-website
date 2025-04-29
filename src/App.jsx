import { useEffect, useState } from "react";
import "./App.css";

const TABLES = ["Table 1", "Table 2", "Table 3"];

export default function App() {
  const [orderId, setOrderId] = useState("");
  const [price, setPrice] = useState("");
  const [dish, setDish] = useState("");
  const [selectedTable, setSelectedTable] = useState(TABLES[0]);
  const [orders, setOrders] = useState({});

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("restaurant-orders");
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem("restaurant-orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = () => {
    if (!orderId || !price || !dish) return alert("Please fill all fields");
    const newOrder = { orderId, price, dish };
    setOrders((prev) => {
      const updatedTable = [...(prev[selectedTable] || []), newOrder];
      return { ...prev, [selectedTable]: updatedTable };
    });
    setOrderId("");
    setPrice("");
    setDish("");
  };

  const handleDelete = (table, idToDelete) => {
    setOrders((prev) => {
      const updated = prev[table].filter((order) => order.orderId !== idToDelete);
      return { ...prev, [table]: updated };
    });
  };

  return (
    <div className="container">
      <h1 className="heading">Restaurant Order System</h1>

      <div className="input-grid">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dish"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
        />
        <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
          {TABLES.map((table) => (
            <option key={table}>{table}</option>
          ))}
        </select>
      </div>

      <button className="add-button" onClick={handleAddOrder}>
        Add to Bill
      </button>

      <div className="tables">
        {TABLES.map((table) => (
          <div key={table} className="table-box">
            <h2>{table}</h2>
            {orders[table]?.length > 0 ? (
              <ul>
                {orders[table].map((order) => (
                  <li key={order.orderId} className="order-item">
                    <span>
                      {order.dish} - ₹{order.price} <br /> (ID: {order.orderId})
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(table, order.orderId)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-orders">No orders</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
