"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111218] px-4 pt-24">
      <div className="bg-[#181920] rounded-2xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Contact Us</h1>
        <p className="text-gray-400 mb-6 text-center">We'd love to hear from you!</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="bg-[#23242b] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="bg-[#23242b] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
            value={form.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Type your message..."
            rows={4}
            className="bg-[#23242b] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e50914] resize-none"
            value={form.message}
            onChange={handleChange}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-2 py-3 px-8 rounded-lg font-semibold text-white bg-[#e50914] hover:bg-[#b0060f] transition-all duration-300 shadow text-lg"
          >
            Send Message
          </button>
          {sent && <div className="text-green-500 text-center mt-2">Message sent successfully!</div>}
        </form>
        <div className="flex justify-center mt-8">
        </div>
      </div>
    </div>
  );
}
