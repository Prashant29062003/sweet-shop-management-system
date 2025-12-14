import { useState } from "react";

export default function SweetForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    price: initialValues.price || "",
    quantityInStock: initialValues.quantityInStock || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <input
        name="name"
        placeholder="Sweet name"
        value={form.name}
        onChange={handleChange}
        className="input"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="input"
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="input"
      />

      <input
        name="quantityInStock"
        type="number"
        placeholder="Stock"
        value={form.quantityInStock}
        onChange={handleChange}
        className="input"
      />

      <button className="btn-primary w-full">
        {submitLabel}
      </button>
    </form>
  );
}
