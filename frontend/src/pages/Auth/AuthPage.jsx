import { useState } from "react";
import Login from "./Login.jsx";
import Registration from "./Registration.jsx";
import logo from "../../assets/logo.png";

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
				<img src={logo} alt="logo" className={"m-auto w-60"} />
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
							Registrieren
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
