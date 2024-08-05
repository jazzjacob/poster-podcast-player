import ClientPage from '../components/ClientPage';
import DataDownloader from '../components/DataDownloader';
import LocalEpisodeUploader from '../components/LocalEpisodeUploader';

function OldSolutionPage() {
  return (
    <>
      {
        /*
        COMPONENTS USED FOR REPLACING OLD EPISODE WITH THE NEW FIREBASE DATA STRUCTURE

        <LocalEpisodeUploader />
        <DataDownloader />
        */
      }
      <ClientPage />
    </>
  );
}

export default OldSolutionPage;
