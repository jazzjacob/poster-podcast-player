export interface Timestamp {
  id: string;
  start: number;
  end: number;
  images: TimestampImage[];
};

export interface TimestampImage {
  id: string;
  image: string;
  description: string;
}

export interface UploadedImage {
  id: string;
  image: string;
  used: boolean;
  timestampIds: string[];
};

export interface EpisodeData {
  podcastName: string,
  episodeNumber: number;
  url: string;
  localPath: string;
  title: string;
  episodeImage: string;
  timestamps: Timestamp[];
  uploadedImages: UploadedImage[];
};

export interface EditModeData {
  startTime: number,
  endTime: number,
  images: TimestampImage[],
}

export interface EditModeTime {
  startTime: {
    hours: number,
    minutes: number,
    seconds: number
  },
  endTime: {
    hours: number,
    minutes: number,
    seconds: number
  }
}




// DEFAULT VALUES
export const defaultEditModeTime: EditModeTime = {
  startTime: {
    hours: -1,
    minutes: -1,
    seconds: -1
  },
  endTime: {
    hours: -1,
    minutes: -1,
    seconds: -1
  }
};

// Default value for editModeData
export const defaultEditModeData: EditModeData = {
  startTime: -1,
  endTime: -1,
  images: [],
};

// Default value for episodeData
export const nullEpisode: EpisodeData = {
  episodeNumber: 0,
  url: "",
  localPath: "",
  podcastName: "",
  title: "",
  episodeImage: "",
  timestamps: [],
  uploadedImages: []
};
