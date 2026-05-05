"use client";
import React from "react";

export default function PleaseLoginModal() {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
			<div className="bg-white rounded-lg shadow-lg p-8 max-w-xs w-full text-center">
				<h2 className="text-2xl font-bold mb-4 text-red-600">PLEASE LOGIN</h2>
				<p className="text-gray-700 mb-6">You must be logged in to access this page.</p>
				<a href="/login" className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition">Go to Login</a>
			</div>
		</div>
	);
}