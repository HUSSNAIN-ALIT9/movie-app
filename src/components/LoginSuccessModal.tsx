"use client";
import React from "react";

export default function LoginSuccessModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-green-600">YOU ARE LOGGED IN</h2>
        <div className="flex flex-col items-center mt-4">
          <div className="flex space-x-1 mb-2">
            <span className="text-2xl font-extrabold animate-bounce" style={{ animationDelay: '0ms', color: '#e50914' }}>M</span>
            <span className="text-2xl font-extrabold animate-bounce" style={{ animationDelay: '150ms', color: '#222' }}>B</span>
            <span className="text-2xl font-extrabold animate-bounce" style={{ animationDelay: '300ms', color: '#09c' }}>U</span>
          </div>
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      </div>
    </div>
  );
}
