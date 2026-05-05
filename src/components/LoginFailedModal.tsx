"use client";
import React from "react";

export default function LoginFailedModal({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-red-600">LOGIN FAILED</h2>
        {message && <p className="text-gray-700 mt-2">{message}</p>}
      </div>
    </div>
  );
}
