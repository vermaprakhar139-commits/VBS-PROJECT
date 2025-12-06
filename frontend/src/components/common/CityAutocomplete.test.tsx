import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CityAutocomplete from "./CityAutocomplete";
import api from "../../api/client";

vi.mock("../../api/client", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("CityAutocomplete", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input field", () => {
    render(
      <CityAutocomplete
        value=""
        onChange={mockOnChange}
        placeholder="Enter city"
        label="City"
      />
    );
    expect(screen.getByPlaceholderText("Enter city")).toBeInTheDocument();
  });

  it("shows suggestions when typing", async () => {
    const mockCities = [
      { id: "DEL", name: "Delhi", state: "Delhi" },
      { id: "BOM", name: "Mumbai", state: "Maharashtra" },
    ];

    (api.get as any).mockResolvedValue({ data: { cities: mockCities } });

    render(
      <CityAutocomplete
        value=""
        onChange={mockOnChange}
        placeholder="Enter city"
        label="City"
      />
    );

    const input = screen.getByPlaceholderText("Enter city");
    await userEvent.type(input, "del");

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/misc/cities?q=del");
    });
  });
});
