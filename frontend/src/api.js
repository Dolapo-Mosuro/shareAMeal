// src/api.js
// Centralized API service for backend communication

const PRODUCTION_API_URL = "https://shareameal-api.onrender.com";
const LEGACY_API_URL = "https://sharemeal-api.onrender.com";

export function resolveApiUrl(configuredUrl, isDevelopment = false) {
	const normalizedUrl = configuredUrl?.trim().replace(/\/+$/, "");

	// Do not let the old Render hostname configured in Vercel shadow the API.
	if (normalizedUrl === LEGACY_API_URL) return PRODUCTION_API_URL;

	return (
		normalizedUrl || (isDevelopment ? "http://localhost:3000" : PRODUCTION_API_URL)
	);
}

const API_URL = resolveApiUrl(
	import.meta.env.VITE_API_URL,
	import.meta.env.DEV,
);

function buildUrl(endpoint = "") {
	const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	return `${API_URL}${cleanEndpoint}`;
}

export async function apiRequest(endpoint, options = {}) {
	const url = buildUrl(endpoint);

	const token = localStorage.getItem("token");
	const headers = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const response = await fetch(url, { ...options, headers });

	const contentType = response?.headers?.get?.("content-type") || "";

	let data;
	if (contentType.includes("application/json")) {
		data = await response.json().catch(() => ({}));
	} else if (
		typeof response?.json === "function" &&
		typeof response?.text !== "function"
	) {
		// test/mock fallback when headers are missing but json() exists
		data = await response.json().catch(() => ({}));
	} else if (typeof response?.text === "function") {
		data = await response.text().catch(() => "");
	} else {
		data = {};
	}

	if (!response.ok) {
		const err = new Error(
			(data && data.message) || `Request failed (${response.status})`,
		);
		err.status = response.status;
		if (data && data.code) err.code = data.code;
		err.payload = data;
		throw err;
	}

	return data;
}
