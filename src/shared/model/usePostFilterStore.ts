import { create } from "zustand"

interface PostFilterState {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  selectedTag: string

  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: string) => void
  setSelectedTag: (tag: string) => void
  setFilters: (filters: Partial<Omit<PostFilterState, "setSkip" | "setLimit" | "setSearchQuery" | "setSortBy" | "setSortOrder" | "setSelectedTag" | "setFilters" | "reset" | "initFromURL">>) => void
  reset: () => void
  initFromURL: (searchParams: URLSearchParams) => void
}

const defaultState = {
  skip: 0,
  limit: 10,
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  selectedTag: "",
}

export const usePostFilterStore = create<PostFilterState>((set) => ({
  ...defaultState,

  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),

  setFilters: (filters) => set(filters),

  reset: () => set(defaultState),

  initFromURL: (searchParams) => {
    const skip = parseInt(searchParams.get("skip") || "0")
    const limit = parseInt(searchParams.get("limit") || "10")
    const searchQuery = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || ""
    const sortOrder = searchParams.get("sortOrder") || "asc"
    const selectedTag = searchParams.get("tag") || ""

    set({ skip, limit, searchQuery, sortBy, sortOrder, selectedTag })
  },
}))
