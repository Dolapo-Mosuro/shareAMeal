import { useEffect, useState } from "react";
import styles from "./SmeDash.module.css";
import { apiRequest } from "../../api";

export default function SmeDash() {
	const [data, setData] = useState({
		meals: [],
		stats: {
			totalMeals: 0,
			totalPickups: 0,
			expiryRate: 0,
		},
	});
	const [form, setForm] = useState({
		title: "",
		description: "",
		quantity: "",
		unit: "",
		prepared_at: "",
		storage_type: "",
		food_type: "",
		food_status: "",
	});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [actionLoading, setActionLoading] = useState(null); // mealId for which action is in progress
	const [error, setError] = useState(null);

	const fetchSMEData = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await apiRequest("/meals/my", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const meals = res.meals || [];
			const totalMeals = meals.length;
			const totalPickups = meals.filter((m) => m.status === "PICKED_UP").length;
			const expired = meals.filter((m) => m.status === "EXPIRED").length;
			setData({
				meals,
				stats: {
					totalMeals,
					totalPickups,
					expiryRate: totalMeals ? Math.round((expired / totalMeals) * 100) : 0,
				},
			});
		} catch (err) {
			console.error(err);
			setError(err?.message || "Failed to load dashboard");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSMEData();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			const token = localStorage.getItem("token");
			await apiRequest("/meals", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					...form,
					quantity: Number(form.quantity),
				}),
			});
			setForm({
				title: "",
				description: "",
				quantity: "",
				unit: "",
				prepared_at: "",
				storage_type: "",
				food_type: "",
				food_status: "",
			});
			await fetchSMEData();
		} catch (err) {
			setError(err?.message || "Failed to create meal");
		} finally {
			setSubmitting(false);
		}
	};

	const handleMarkReady = async (mealId) => {
		setActionLoading(mealId);
		try {
			const token = localStorage.getItem("token");
			await apiRequest(`/meals/${mealId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: "PICKUP_READY" }),
			});
			await fetchSMEData();
		} catch (err) {
			setError(err?.message || "Failed to update meal status");
		} finally {
			setActionLoading(null);
		}
	};

	const handleDelete = async (mealId) => {
		if (!window.confirm("Are you sure you want to delete this meal?")) return;
		setActionLoading(mealId);
		try {
			const token = localStorage.getItem("token");
			await apiRequest(`/meals/${mealId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			await fetchSMEData();
		} catch (err) {
			setError(err?.message || "Failed to delete meal");
		} finally {
			setActionLoading(null);
		}
	};

	const getStatusBadge = (status) => {
		const colorMap = {
			AVAILABLE: "#2d7a46",
			CLAIMED: "#f39c12",
			PICKUP_READY: "#2980b9",
			PICKED_UP: "#8e44ad",
			COMPLETED: "#27ae60",
			EXPIRED: "#e74c3c",
			CANCELLED: "#7f8c8d",
		};
		return (
			<span
				className={styles.statusBadge}
				style={{ background: colorMap[status] || "#bbb" }}
			>
				{status.replace("_", " ")}
			</span>
		);
	};

	if (loading) {
		return <div className={styles.dashboard}>Loading dashboard...</div>;
	}
	if (error) {
		return (
			<div className={styles.dashboard}>
				<p className={styles.error}>Error: {error}</p>
			</div>
		);
	}

	return (
		<div className={styles.dashboard}>
			<div className={styles.header}>
				<h2>Hello, Welcome Back 👋</h2>
				<p className={styles.subtext}>
					Manage your meals and track your impact
				</p>
			</div>

			<div className={styles.statsGrid}>
				<div className={styles.card}>
					<h4>Total Meals</h4>
					<h2>{data.stats.totalMeals}</h2>
				</div>
				<div className={`${styles.card} ${styles.greenCard}`}>
					<h4>Total Pickups</h4>
					<h2>{data.stats.totalPickups}</h2>
				</div>
				<div className={styles.card}>
					<h4>Expiry Rate</h4>
					<h2>{data.stats.expiryRate}%</h2>
				</div>
			</div>

			<div className={styles.section}>
				<h3>Create Meal</h3>
				<form className={styles.form} onSubmit={handleSubmit}>
					<input
						name="title"
						placeholder="Meal Title"
						required
						value={form.title}
						onChange={handleChange}
					/>
					<textarea
						name="description"
						placeholder="Description"
						required
						value={form.description}
						onChange={handleChange}
					/>
					<input
						type="number"
						name="quantity"
						placeholder="Quantity"
						min="1"
						required
						value={form.quantity}
						onChange={handleChange}
					/>
					<select
						name="unit"
						required
						value={form.unit}
						onChange={handleChange}
					>
						<option value="">Select Unit</option>
						<option value="kg">kg</option>
						<option value="servings">servings</option>
						<option value="packs">packs</option>
						<option value="pieces">pieces</option>
					</select>
					<input
						type="datetime-local"
						name="prepared_at"
						required
						value={form.prepared_at}
						onChange={handleChange}
					/>
					<select
						name="storage_type"
						value={form.storage_type}
						onChange={handleChange}
					>
						<option value="">Storage Type</option>
						<option value="Room Temperature">Room Temperature</option>
						<option value="Refrigerated">Refrigerated</option>
					</select>
					<select
						name="food_type"
						value={form.food_type}
						onChange={handleChange}
					>
						<option value="">Food Type</option>
						<option value="Rice">Rice</option>
						<option value="Bread">Bread</option>
						<option value="Soup">Soup</option>
						<option value="Beans">Beans</option>
					</select>
					<select
						name="food_status"
						value={form.food_status}
						onChange={handleChange}
					>
						<option value="">Food Status</option>
						<option value="Fresh">Fresh</option>
						<option value="Moderate">Moderate</option>
						<option value="Spoiled">Spoiled</option>
					</select>
					<button type="submit" disabled={submitting}>
						{submitting ? "Creating..." : "Create Meal"}
					</button>
				</form>
			</div>

			<div className={styles.section}>
				<h3>Your Meals</h3>
				{data.meals.length === 0 ? (
					<div className={styles.empty}>No meals created yet.</div>
				) : (
					<div className={styles.mealsGrid}>
						{data.meals.map((meal) => (
							<div key={meal.id} className={styles.mealCard}>
								<div className={styles.mealHeader}>
									<h4>{meal.title}</h4>
									{getStatusBadge(meal.status)}
								</div>
								<p>Quantity: {meal.quantity}</p>
								<p>Unit: {meal.unit}</p>
								<p>
									Prepared: {meal.prepared_at?.slice(0, 16).replace("T", " ")}
								</p>
								{meal.status === "CLAIMED" && (
									<button
										className={styles.actionBtn}
										disabled={actionLoading === meal.id}
										onClick={() => handleMarkReady(meal.id)}
									>
										{actionLoading === meal.id ? "Marking..." : "Mark Ready"}
									</button>
								)}
								{["AVAILABLE", "EXPIRED", "CANCELLED"].includes(
									meal.status,
								) && (
									<button
										className={styles.deleteBtn}
										disabled={actionLoading === meal.id}
										onClick={() => handleDelete(meal.id)}
									>
										{actionLoading === meal.id ? "Deleting..." : "Delete"}
									</button>
								)}
								{["PICKUP_READY", "PICKED_UP", "COMPLETED"].includes(
									meal.status,
								) && <p className={styles.infoText}>No actions available</p>}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
