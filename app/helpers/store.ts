import { create } from "zustand";
import { examplePodcastData, PodcastData, nullEpisode, EpisodeData, EditModeData, TimestampImage, defaultEditModeData } from "./customTypes";

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

interface CurrentEpisodeState {
  currentEpisode: EpisodeData | null;
  setCurrentEpisode: (episode: EpisodeData) => void;
  clearCurrentEpisode: () => void;
}

interface CurrentEditState {
  currentEdit: EditModeData;
  setCurrentEdit: (currentEdit: EditModeData) => void;
  clearCurrentEdit: () => void;
}

interface InitialEditState {
  initialEdit: EditModeData;
  setInitialEdit: (initialEdit: EditModeData) => void;
  clearInitialEdit: () => void;
}

interface CurrentTimeState {
  currentTime: number;
  setCurrentTime:  (currentTime: number) => void;
  clearCurrentTime: () => void;
}

interface PlayFromTimeState {
  playFromTime: number;
  setPlayFromTime: (playFromTime: number) => void;
  clearPlayFromTime: () => void;
}

const useStore = create<AuthState & PodcastState & CurrentPodcastState & CurrentEpisodeState & CurrentEditState & InitialEditState & CurrentTimeState & PlayFromTimeState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  podcasts: [],
  setPodcasts: (podcasts) => set({ podcasts }),
  addPodcast: (podcast) => set((state) => ({ podcasts: [...state.podcasts, podcast] })),
  clearPodcasts: () => set({ podcasts: [] }),

  podcast: null,
  setPodcast: (podcast) => set({ podcast }),
  clearPodcast: () => set({ podcast: null }),

  currentEpisode: null,
  setCurrentEpisode: (currentEpisode) => set({ currentEpisode }),
  clearCurrentEpisode: () => set({ currentEpisode: null }),

  currentEdit: defaultEditModeData,
  setCurrentEdit: (currentEdit) => set({ currentEdit }),
  clearCurrentEdit: () => set({ currentEdit: defaultEditModeData }),

  initialEdit: defaultEditModeData,
  setInitialEdit: (initialEdit) => set({ initialEdit }),
  clearInitialEdit: () => set({ initialEdit: defaultEditModeData }),

  currentTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  clearCurrentTime: () => set({ currentTime: 0 }),

  playFromTime: -1,
  setPlayFromTime: (playFromTime) => set({ playFromTime }),
  clearPlayFromTime: () => set({ playFromTime: -1 }),
}));

export default useStore;
