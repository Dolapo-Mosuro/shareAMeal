import { apiRequest } from "./api";
import { vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(() => null),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe("apiRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.getItem.mockReturnValue(null);
	});

	it("should successfully fetch data from the API endpoint", async () => {
		const mockData = { id: 1, name: "Test" };
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		});

		const data = await apiRequest("/test");
		expect(data).toEqual(mockData);
		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining("/test"),
			expect.any(Object),
		);
	});

	it("should throw with status property on error response", async () => {
		const errorData = { message: "Not found" };
		global.fetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			json: async () => errorData,
		});

		await expect(apiRequest("/nonexistent-endpoint")).rejects.toHaveProperty(
			"status",
		);
	});

	it("should include Authorization header when token exists", async () => {
		localStorageMock.getItem.mockReturnValue("test-token");
		const mockData = { success: true };
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		});

		await apiRequest("/auth-endpoint");
		const callArgs = global.fetch.mock.calls[0][1];
		expect(callArgs.headers.Authorization).toBe("Bearer test-token");
	});
});
