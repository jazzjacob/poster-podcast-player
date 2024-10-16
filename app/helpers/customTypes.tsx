export interface Timestamp {
  id: string;
  start: number;
  end: number;
  images: TimestampImage[];
  createdAt: Date;
  updatedAt: Date;
};

export interface TimestampImage {
  id: string;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  uploadedImageId?: string;
}

export interface UploadedImage {
  id: string;
  name: string;
  url: string;
  timestampIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export interface PodcastData {
  id: string;
  podcastName: string;
  episodes: EpisodeData[];
  createdAt: Date;
  updatedAt: Date;
  draft: boolean;
  color?: string;
  itunesId: string;
  description?: string;
  image?: string;
  year?: number;
  category?: string;
  host?: string;
  totalEpisodes?: number;
  website?: string;
}

export interface EpisodeData {
  id: string;
  episodeNumber: number;
  url: string;
  title: string;
  timestamps: Timestamp[];
  uploadedImages: UploadedImage[];
  duration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
  draft: boolean;
  owner: string;
  localPath?: string;
  episodeImage?: string;
  releaseDate?: Date;
  description?: string; // brief summary
  showNotes?: string; // detailed notes
  tags?: string[];
}

export interface EditModeData {
  startTime: number,
  endTime: number,
  images: TimestampImage[],
  startTimeSaved: boolean,
  endTimeSaved: boolean,
  timestampId?: string,
  timeDetails?: {
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

export interface OverlapDetails {
  startTimeOverlap: boolean,
  endTimeOverlap: boolean,
  closestStartTime: number,
  closestEndTime: number,
  overlapId: string
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
  timestampId: "",
  timeDetails: defaultEditModeTime,
};

// Default value for episodeData
export const nullEpisode: EpisodeData = {
  id: "",
  episodeNumber: 0,
  url: "",
  localPath: "",
  title: "",
  duration: -1,
  draft: true,
  owner: "",
  episodeImage: "",
  timestamps: [],
  uploadedImages: [],
  createdAt: new Date('2024-07-10T12:34:56Z'),
  updatedAt: new Date('2024-07-10T12:34:56Z')
};

export const nullPodcast: PodcastData = {
  id: "",
  podcastName: "",
  description: "",
  image: "",
  draft: true,
  year: 0,
  itunesId: "",
  category: "",
  host: "",
  totalEpisodes: 0,
  website: "",
  episodes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  color: ""
};

export const examplePodcastData: PodcastData = {
  itunesId: "",
  id: "0",
  podcastName: "The Poster Gals",
  description: "A podcast about movie posters and shit",
  image: "",
  draft: true,
  year: 2024,
  category: "Talking",
  host: "",
  totalEpisodes: 10,
  website: "http://example.com",
  episodes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  color: "dodgerblue"
};

export const exampleEpisodeData: EpisodeData = {
  id: "0",
  episodeNumber: 1,
  url: "https://traffic.libsyn.com/secure/theposterboys/posterboys-059-2019inreview.mp3",
  title: "Episode 1: The Talk",
  createdAt: new Date('2024-07-10T12:34:56Z'),
  updatedAt: new Date('2024-07-10T12:34:56Z'),
  timestamps: [],
  uploadedImages: [],
  duration: 1800, // 30 minutes in seconds
  localPath: "/path/to/local/file", // Optional local file path
  episodeImage: "", // Optional episode image
  releaseDate: new Date('2024-07-01'), // Optional release date
  description: "In this introductory episode, we discuss the basics of podcasting and what to expect in future episodes.",
  showNotes: "Detailed show notes including key topics discussed, links to resources mentioned, and timestamps for important moments.",
  tags: ["Podcasting", "Introduction", "Tips"], // Optional tags or categories
  draft: true,
  owner: "jlindstr2@gmail.com"
};

/*
export const exampleEpisodeData: EpisodeData = {
  id: "3",
  episodeNumber: 59,
  url: "https://traffic.libsyn.com/secure/theposterboys/posterboys-059-2019inreview.mp3",
  title: "Episode 59: 2019 In Review",
  createdAt: new Date('2024-07-10T12:34:56Z'),
  updatedAt: new Date('2024-07-10T12:34:56Z'),
  timestamps: [
    {
      id: "1",
      start: 0,
      end: 10,
      createdAt: new Date('2024-07-10T12:34:56Z'),
      updatedAt: new Date('2024-07-10T12:34:56Z'),
      images: [
        {
          id: "1-1",
          image: "https://firebasestorage.googleapis.com/v0/b/poster-podcast-player.appspot.com/o/podcasts%2Fthe-poster-boys%2Fepisode-59%2Fonce-upon-1.jpg?alt=media&token=38a05d9d-f8c3-4d87-9b8c-3fc4753783a4",
          description: "Description for timestamp 1 image 1",
          createdAt: new Date('2024-07-10T12:34:56Z'),
          updatedAt: new Date('2024-07-10T12:34:56Z')
        },
      ],
    },
    // Add more timestamps as needed
  ],
  uploadedImages: [
    {
      id: "1",
      name: "once-upon-1.jpg",
      url: "https://firebasestorage.googleapis.com/v0/b/poster-podcast-player.appspot.com/o/podcasts%2Fthe-poster-boys%2Fepisode-59%2Fonce-upon-1.jpg?alt=media&token=38a05d9d-f8c3-4d87-9b8c-3fc4753783a4",
      timestampIds: [],
      createdAt: new Date('2024-07-09T12:34:56Z'),
      updatedAt: new Date('2024-07-09T12:34:56Z')
    },
    // Add more uploaded images as needed
  ],
  duration: 1800, // 30 minutes in seconds
  localPath: "/path/to/local/file", // Optional local file path
  episodeImage: "https://firebasestorage.googleapis.com/v0/b/poster-podcast-player.appspot.com/o/podcasts%2Fthe-poster-boys%2Fimages%2F1200x1200bb-75.jpg?alt=media&token=f2cc2a3f-4280-477b-ae5d-d04e4c58c624", // Optional episode image
  releaseDate: new Date('2024-07-01'), // Optional release date
  description: "In this introductory episode, we discuss the basics of podcasting and what to expect in future episodes.",
  showNotes: "Detailed show notes including key topics discussed, links to resources mentioned, and timestamps for important moments.",
  tags: ["Podcasting", "Introduction", "Tips"], // Optional tags or categories
};

*/


export const defaultExampleTimestamps: Timestamp[] = [
  {
    id: "1",
    start: 0,
    end: 10,
    createdAt: new Date('2024-07-09T12:34:56Z'),
    updatedAt: new Date('2024-07-10T12:34:56Z'),
    images: [
      {
        id: "1-1",
        image: "last-black-man-1.jpg",
        description: "Theatrical poster",
        createdAt: new Date('2024-07-09T12:34:56Z'),
        updatedAt: new Date('2024-07-10T12:34:56Z'),
      },
      {
        id: "1-2",
        image: "last-black-man-2.jpg",
        description: "Theatrical poster",
        createdAt: new Date('2024-07-09T12:34:56Z'),
        updatedAt: new Date('2024-07-10T12:34:56Z'),
      },
    ]
  },
  {
    id: "2",
    start: 20,
    end: 30,
    createdAt: new Date('2024-07-09T12:34:56Z'),
    updatedAt: new Date('2024-07-10T12:34:56Z'),
    images: [
      {
        id: "2-1",
        image: "in-fabric-1.jpg",
        description: "Infabric theatrical poster 1",
        createdAt: new Date('2024-07-09T12:34:56Z'),
        updatedAt: new Date('2024-07-10T12:34:56Z'),
      },
      {
        id: "2-2",
        image: "in-fabric-2.jpg",
        description: "In fabric theatrical poster 2",
        createdAt: new Date('2024-07-09T12:34:56Z'),
        updatedAt: new Date('2024-07-10T12:34:56Z'),
      },
    ]
  },
  {
    id: "3",
    start: 11,
    end: 19,
    createdAt: new Date('2024-07-09T12:34:56Z'),
    updatedAt: new Date('2024-07-10T12:34:56Z'),
    images: [
      {
        id: "3-1",
        image: "the-dead-1.jpg",
        description: "In fabric theatrical poster 2",
        createdAt: new Date('2024-07-09T12:34:56Z'),
        updatedAt: new Date('2024-07-10T12:34:56Z'),
      },
    ]
  }
];
