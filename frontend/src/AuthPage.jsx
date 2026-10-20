import { useState } from "react";
import Login from "./Login";
import Registration from "./Registration";

function AuthPage({ onLogin }) {
	const [tab, setTab] = useState("login");

	const tabClass = (name) =>
			`flex-1 py-2 text-sm font-medium border-b-2 ${
					tab === name
							? "border-blue-600 text-blue-600"
							: "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
			}`;

	return (
			<div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center pt-12 px-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
					Subscription Manager
				</h1>

				<div className="w-full max-w-sm">
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
	);
}

export default AuthPage;