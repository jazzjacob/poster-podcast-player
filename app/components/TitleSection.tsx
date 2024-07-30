import { fetchAllPodcasts } from "../firebase/firestoreOperations";

async function TitleSection() {
  const allPodcasts = await fetchAllPodcasts();
  const podcast = allPodcasts[0];
  console.log(podcast.podcastName);

  return (
    <>
      <p>Podcast name: {podcast.podcastName}</p>
    </>
  );
}

export default TitleSection;
