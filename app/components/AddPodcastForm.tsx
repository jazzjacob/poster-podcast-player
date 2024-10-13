function AddPodcastForm() {
  return (
    <>
      <p>This is the addpodcastform</p>
      <form>
        <div className="form-example">
          <label htmlFor="podcastName">Podcast name: </label>
          <input type="text" name="podcastName" id="podcastName" required />
          <label htmlFor="podcastName">Podcast name: </label>
          <input type="text" name="podcastName" id="podcastName" required />
        </div>
      </form>
    </>
  );
}

export default AddPodcastForm;
