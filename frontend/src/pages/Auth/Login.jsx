import {useState} from "react";

function Login ({ onLogin }) {

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
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) {
				setMessage({type: "error", text: data.error});
			} else {
				setMessage({type: "success", text: `User "${data.username}" logged in`});
				onLogin(data)
			}
		} catch {
			setMessage({type: "error", text: "Could not reach the server"});
		}
	};
	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm flex flex-col gap-4"
			>
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
				<button
					type="submit"
					className="btn-primary"
				>
					Login
				</button>
			</form>

			{message && (
				<p className={`mt-4 text-sm ${message.type === "error" ? "t-error" : "t-success"}`}>
					{message.text}
				</p>
			)}
		</>
	)
}

export default Login;