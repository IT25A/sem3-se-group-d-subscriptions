import { useState } from "react";
import logo from "../assets/logo.png";

function Login({ onLogin }) {
	const [form, setForm] = useState({ username: "", password: "" });
	const [message, setMessage] = useState(null);

	const handleChange = (e) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage(null);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) {
				setMessage({ type: "error", text: data.error });
			} else {
				setMessage({ type: "success", text: `User "${data.username}" logged in` });
				onLogin(data);
			}
		} catch {
			setMessage({ type: "error", text: "Could not reach the server" });
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
				<input
					name="username"
					placeholder="Username"
					value={form.username}
					onChange={handleChange}
					required
					className="input-field"
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					required
					className="input-field"
				/>
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
			{message && (
				<p className={`text-center mt-4 text-sm ${message.type === "error" ? "t-error" : "t-success"}`}>
					{message.text}
				</p>
			)}
		</>
	);
}

function Registration({ onSuccess }) {
	const [form, setForm] = useState({ username: "", email: "", password: "" });
	const [message, setMessage] = useState(null);

	const handleChange = (e) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage(null);
		try {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) {
				setMessage({ type: "error", text: data.error });
			} else {
				setMessage({ type: "success", text: `User "${data.username}" created (id: ${data.id})` });
				setForm({ username: "", email: "", password: "" });
				onSuccess?.();
			}
		} catch {
			setMessage({ type: "error", text: "Could not reach the server" });
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
				<input
					name="username"
					placeholder="Username"
					value={form.username}
					onChange={handleChange}
					required
					className="input-field"
				/>
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					required
					className="input-field"
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					required
					className="input-field"
				/>
				<button type="submit" className="btn btn-primary">
					Create user
				</button>
			</form>
			{message && (
				<p className={`mt-4 text-sm ${message.type === "error" ? "t-error" : "t-success"}`}>
					{message.text}
				</p>
			)}
		</>
	);
}

function AuthPage({ onLogin }) {
	const [tab, setTab] = useState("login");

	const tabClass = (name) =>
		`flex-1 py-2 text-sm font-medium border-b-2 cursor-pointer ${
			tab === name
				? "t-accent"
				: "border-transparent t-secondary hover:opacity-50"
		}`;

	return (
		<div className="page-wrapper flex flex-col items-center justify-center px-4">
			<div className="w-full max-w-md">
				<img src={logo} alt="logo" className={"m-auto w-40 mb-5"} />
				<h1 className="text-3xl font-bold t-primary mb-2 text-center">
					PENNYwise
				</h1>
				<p className="t-muted text-center mb-8">Manage your subscriptions</p>
				<div className="card p-8">
					<div className="flex mb-6" role="tablist">
						<button
							role="tab"
							aria-selected={tab === "login"}
							onClick={() => setTab("login")}
							className={tabClass("login")}
						>
							Login
						</button>
						<button
							role="tab"
							aria-selected={tab === "register"}
							onClick={() => setTab("register")}
							className={tabClass("register")}
						>
							Register
						</button>
					</div>

					{tab === "login" ? (
						<Login onLogin={onLogin} />
					) : (
						<Registration onSuccess={() => setTab("login")} />
					)}
				</div>
			</div>
		</div>
	);
}

export default AuthPage;