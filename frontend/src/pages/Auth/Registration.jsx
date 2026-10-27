import {useState} from "react";

function Registration ({ onSuccess }) {

	const [form, setForm] = useState({ username: "", email: "", password: "" });
	const [message, setMessage] = useState(null);

	const handleChange = (e) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage(null);
		try {
			const res = await fetch("/api/users/create", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) {
				setMessage({type: "error", text: data.error});
			} else {
				setMessage({type: "success", text: `User "${data.username}" created (id: ${data.id})`});
				setForm({username: "", email: "", password: ""});
				onSuccess?.();
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
				<button
					type="submit"
					className="btn-primary"
				>
					Create user
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

export default Registration;
