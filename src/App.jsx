import React, { useEffect, useState } from "react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const loadProducts = async () => {
    try {
      const productRes = await fetch(
        "http://localhost:3000/api/products"
      );
      const productData = await productRes.json();
      setProducts(productData);

      const categoryRes = await fetch(
        "http://localhost:3000/api/categories"
      );
      const categoryData = await categoryRes.json();
      setCategories(categoryData);
    } catch (error) {
      console.error("Fetch data unsuccess:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("ต้องการลบสินค้านี้หรือไม่")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "ลบสินค้าไม่สำเร็จ");
        return;
      }

      loadProducts();
      alert("ลบสินค้าเรียบร้อย");
    } catch (error) {
      console.error("Delete product error:", error);
      alert("ไม่สามารถเชื่อมต่อกับ Server ได้");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("ต้องการลบหมวดหมู่นี้หรือไม่")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "ลบหมวดหมู่ไม่สำเร็จ");
        return;
      }

      loadProducts();
      alert("ลบหมวดหมู่เรียบร้อย");
    } catch (error) {
      console.error("Delete category error:", error);
      alert("ไม่สามารถเชื่อมต่อกับ Server ได้");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            price: Number(price),
            stock: Number(stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server Error:", data);
        alert(
          data.message || "เพิ่มสินค้าไม่สำเร็จ"
        );
        return;
      }
      loadProducts();
      setName("");
      setPrice("");
      setStock("");

      alert("เพิ่มสินค้าเรียบร้อย");
    } catch (error) {
      console.error("Add product error:", error);
      alert("ไม่สามารถเชื่อมต่อกับ Server ได้");
    }
  };

  return (
    <div className="container mt-4 mb-5">

      {/* Add Product */}
      <div className="card p-3 mb-4">
        <h5 className="text-center mb-3">
          Add Product
        </h5>

        <div className="row g-2">

          {/* Name */}
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}  />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}  />
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              >
              Add
            </button>
          </div>

        </div>
      </div>
      <h1 className="mb-3">
        Categories List
      </h1>

      <table className="table table-bordered table-striped mb-5">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <h1 className="mb-3">
        Products List
      </h1>

      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((prd) => (
            <tr key={prd.id}>
              <td>{prd.id}</td>
              <td>{prd.name}</td>
              <td>{prd.price}</td>
              <td>{prd.stock}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(prd.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default App;