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
