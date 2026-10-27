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
						className="border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
				/>
				<input
						name="email"
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						required
						className="border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
				/>
				<input
						name="password"
						type="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
						required
						className="border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
				/>
				<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm"
				>
					Create user
				</button>
			</form>

			{message && (
					<p className={`mt-4 text-sm ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>
						{message.text}
					</p>
			)}
		</>
		)
}

export default Registration;
