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
  timestamps: Timestamp[],
  uploadedImages: UploadedImage[],
};

export interface EditModeData {
  startTime: number,
  endTime: number,
  images: TimestampImage[],
  startTimeSaved: boolean,
  endTimeSaved: boolean,
  timestampId: string
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
  startTimeSaved: false,
  endTimeSaved: false,
  timestampId: ""
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


export const defaultExampleTimestamps: Timestamp[] = [
  {
    id: "1",
    start: 0,
    end: 10,
    images: [
      {
        id: "1-1",
        image: "last-black-man-1.jpg",
        description: "Theatrical poster"
      },
      {
        id: "1-1",
        image: "last-black-man-2.jpg",
        description: "Theatrical poster"
      },
    ]
  },
  {
    id: "2",
    start: 11,
    end: 20,
    images: [
      {
        id: "2-1",
        image: "in-fabric-1.jpg",
        description: "Infabric theatrical poster 1"
      },
      {
        id: "2-2",
        image: "in-fabric-2.jpg",
        description: "In fabric theatrical poster 2"
      },
    ]
  }
]
