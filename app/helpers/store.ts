import { create } from "zustand";
import { examplePodcastData, PodcastData, nullEpisode } from "./customTypes";

export const usePodcastStore = create<PodcastData[]>()((set) => ([examplePodcastData]));

interface AuthState {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
}

interface PodcastState {
  podcasts: PodcastData[];
  setPodcasts: (podcasts: PodcastData[]) => void;
  addPodcast: (podcast: PodcastData) => void;
  clearPodcasts: () => void;
}

interface CurrentPodcastState {
  podcast: PodcastData | null;
  setPodcast: (podcast: PodcastData) => void;
  clearPodcast: () => void;
}

const useStore = create<AuthState & PodcastState & CurrentPodcastState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  podcasts: [],
  setPodcasts: (podcasts) => set({ podcasts }),
  addPodcast: (podcast) => set((state) => ({ podcasts: [...state.podcasts, podcast] })),
  clearPodcasts: () => set({ podcasts: [] }),

  podcast: null,
  setPodcast: (podcast) => set({ podcast }),
  clearPodcast: () => set({ podcast: null })
}));

export default useStore;
