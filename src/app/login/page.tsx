"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";


export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		setError("");
		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push("/");
		} catch (err: any) {
			setError(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div style={{
				minHeight: "100vh",
				background: "#101014",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center"
			}}>
				<div style={{
					background: "#181824",
					padding: "2.5rem 2rem 2rem 2rem",
					borderRadius: 12,
					boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
					width: 350,
					maxWidth: "90vw"
				}}>
					<div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 8 }}>
						<span style={{ color: "#ff253a", fontWeight: 700, fontSize: 24 }}>MovieFlix</span>
					</div>
					<h2 style={{ color: "#fff", marginBottom: 8, fontWeight: 600, fontSize: 22 }}>Welcome Back!</h2>
					<p style={{ color: "#aaa", marginBottom: 24, fontSize: 14 }}>Please login to your account</p>
					<form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
						<label style={{ color: "#fff", fontSize: 14 }}>
							Email address
							<input
								type="email"
								placeholder="Enter your email"
								required
								value={email}
								onChange={e => setEmail(e.target.value)}
								style={{
									width: "100%",
									marginTop: 6,
									padding: "10px 12px",
									borderRadius: 6,
									border: "1px solid #232334",
									background: "#232334",
									color: "#fff",
									fontSize: 15
								}}
							/>
						</label>
						<label style={{ color: "#fff", fontSize: 14 }}>
							Password
							<input
								type="password"
								placeholder="Enter your password"
								required
								value={password}
								onChange={e => setPassword(e.target.value)}
								style={{
									width: "100%",
									marginTop: 6,
									padding: "10px 12px",
									borderRadius: 6,
									border: "1px solid #232334",
									background: "#232334",
									color: "#fff",
									fontSize: 15
								}}
							/>
						</label>
						<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
							<a href="#" style={{ color: "#ff253a", fontSize: 13, textDecoration: "none" }}>Forgot Password?</a>
						</div>
						<button
							type="submit"
							style={{
								background: loading ? "#ff253a99" : "#ff253a",
								color: "#fff",
								border: "none",
								borderRadius: 6,
								padding: "12px 0",
								fontWeight: 600,
								fontSize: 16,
								cursor: loading ? "not-allowed" : "pointer",
								marginBottom: 8
							}}
							disabled={loading}
						>
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>
					<div style={{ color: "#aaa", fontSize: 14, marginTop: 12, textAlign: "center" }}>
						Don&apos;t have an account? <a href="/signup" style={{ color: "#ff253a", textDecoration: "none", fontWeight: 500 }}>Signup</a>
					</div>
				</div>
			</div>
		</>
	);
}