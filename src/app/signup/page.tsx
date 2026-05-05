"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [agreed, setAgreed] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (!agreed) {
			setError("You must agree to the Terms & Conditions");
			return;
		}
		setLoading(true);
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			// Update user profile with name
			if (auth.currentUser) {
				await updateProfile(auth.currentUser, { displayName: name });
				await auth.currentUser.reload(); // Force reload to update displayName
			}
			router.push("/"); // Signup ke baad home page par redirect
		} catch (err: any) {
			setError(err.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	};

	return (
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
				width: 400,
				maxWidth: "95vw"
			}}>
				<div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 8 }}>
					<span style={{ color: "#ff253a", fontWeight: 700, fontSize: 24 }}>MovieFlix</span>
				</div>
				<h2 style={{ color: "#fff", marginBottom: 8, fontWeight: 600, fontSize: 22 }}>Create your account</h2>
				<p style={{ color: "#aaa", marginBottom: 24, fontSize: 14 }}>Sign up to start watching movies</p>
				<form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
					<label style={{ color: "#fff", fontSize: 14 }}>
						Full Name
						<input
							type="text"
							placeholder="Enter your name"
							required
							value={name}
							onChange={e => setName(e.target.value)}
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
					<label style={{ color: "#fff", fontSize: 14 }}>
						Confirm Password
						<input
							type="password"
							placeholder="Confirm your password"
							required
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
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
					<div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
						<input
							type="checkbox"
							required
							checked={agreed}
							onChange={e => setAgreed(e.target.checked)}
							style={{ accentColor: "#ff253a" }}
						/>
						<span style={{ color: "#aaa", fontSize: 13 }}>I agree to the Terms & Conditions</span>
					</div>
					{error && <div style={{ color: "#ff253a", fontSize: 14, marginBottom: 8 }}>{error}</div>}
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
						{loading ? "Signing up..." : "Sign Up"}
					</button>
				</form>
				<div style={{ color: "#aaa", fontSize: 14, marginTop: 12, textAlign: "center" }}>
					Already have an account? <a href="/login" style={{ color: "#ff253a", textDecoration: "none", fontWeight: 500 }}>Login</a>
				</div>
			</div>
		</div>
	);
}