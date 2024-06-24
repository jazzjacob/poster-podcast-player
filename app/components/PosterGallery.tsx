
const PosterGallery = (episodeData) => {

  console.log("episode data from within PosterGallery");
  console.log(episodeData);


  return (
    <div>
      <h2>This is the poster gallery</h2>

      {episodeData ? (
        <div>
          <p>Images should be displayed here.</p>
          {
            episodeData.episodeData.timestamps.map(
              (timestamp: any) => {
                return (
                  <img style={{height: "100px"}} src={`/images/episode-59/${timestamp.image}`} />
                )
              }
            )
          }
        </div>
      ):(
        <p>No images</p>
      )}
    </div>
  );
}

export default PosterGallery;
