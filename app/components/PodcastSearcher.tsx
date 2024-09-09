function formatSearchTerm(term: string) {
  let formattedTerm = term.toLowerCase();
  formattedTerm = formattedTerm.split(' ').join('+');


  console.log(formattedTerm);
  return formattedTerm;
}

function formatForItunesSearch(input: string): string {
    let formatted = input;
    formatted = formatted.toLowerCase();
    formatted = formatted.replace(/\s+/g, ' ');
    formatted = formatted.replace(/[^\p{L}\d\s]/gu, '');
    formatted = formatted.trim();
    formatted = formatted.replace(/\s/g, '%20');

    return formatted;
}

function PodcastSearcher() {

  const searchTerm = 'the poster boys';
  const formattedTerm = formatForItunesSearch(searchTerm);
  const url = `https://itunes.apple.com/search?term=${formattedTerm}&country=us&media=podcast&entity=podcast`;
  console.log(url);

  function delay(delayInMilliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
  }

  async function fetchData(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results);
  }

  function search(term: string) {
    const formattedTerm = formatForItunesSearch(term);
    const url = `https://itunes.apple.com/search?term=${formattedTerm}&country=us&media=podcast&entity=podcast`;
    console.log(url);
    fetchData(url);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    let textInput = event.target[0].value;
    if (textInput !== '') {
      console.log(textInput);
      event.target[0].value = '';
      search(textInput);
    } else {
      console.log('Empty field!');
    }
  }

  return (
    <>
      <p>This is podcast searcher</p>
      <form onSubmit={handleSubmit}>
        <input type='text'></input>
        <button type='submit'>Search</button>
      </form>
      <button onClick={() => fetchData()}>fetch data</button>
    </>
  );
}

export default PodcastSearcher;
