import { renderHook, act } from "@testing-library/react";
import { useUniversities } from "../hooks/useUniversities";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { faker } from "@faker-js/faker";

const server = setupServer(
  rest.get("http://universities.hipolabs.com/search", (req, res, ctx) => {
    const query = req.url.searchParams.get("name");

    if (query === "fail") {
      return res(ctx.status(500));
    }

    const mockData = Array.from({ length: 3 }, () => ({
      name: faker.company.name(),
      country: faker.location.country(),
    }));

    return res(ctx.json(mockData));
  })
);

// Enable API mocking before tests.
beforeAll(() => server.listen());
// Reset handlers after each test for clean slate.
afterEach(() => server.resetHandlers());
// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("useUniversities hook", () => {
  it("should fetch universities successfully", async () => {
    const { result } = renderHook(() => useUniversities());

    await act(async () => {
      await result.current.fetchUniversities("test");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.universities.length).toBe(3);
  });

  it("should handle fetch error", async () => {
    const { result } = renderHook(() => useUniversities());

    await act(async () => {
      await result.current.fetchUniversities("fail");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch universities");
    expect(result.current.universities.length).toBe(0);
  });

  it("should not fetch universities if query is empty", async () => {
    const { result } = renderHook(() => useUniversities());

    await act(async () => {
      await result.current.fetchUniversities("");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.universities.length).toBe(0);
  });

  it("should set loading state correctly", async () => {
    const { result } = renderHook(() => useUniversities());

    act(() => {
      result.current.fetchUniversities("test");
    });

    expect(result.current.loading).toBe(true);
  });
});
