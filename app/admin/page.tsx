import DataDownloader from '../components/DataDownloader';
import LocalEpisodeUploader from '../components/LocalEpisodeUploader';
import AdminPage from '../components/AdminPage'
import AuthComponent from '../components/AuthComponent';

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
      <AuthComponent />
      <AdminPage />
    </>
  );
}

export default OldSolutionPage;
