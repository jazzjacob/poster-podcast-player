import { fetchAllPodcasts } from "../firebase/firestoreOperations";

async function TitleSection() {
  const allPodcasts = await fetchAllPodcasts();
  const podcast = allPodcasts[0];
  console.log(podcast.podcastName);

  return (
    <>
      <p>This a test for TitleSection</p>
      <p>Podcast name: {podcast.podcastName}</p>
      <p>This is a successful test!</p>
    </>
  );
}

export default TitleSection;
