import { create } from "zustand";

interface BookingState {
  search: {
    fromCity: string;
    toCity: string;
    date: string;
  };
  setSearch: (payload: BookingState["search"]) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  search: { fromCity: "", toCity: "", date: "" },
  setSearch: (search) => set({ search })
}));