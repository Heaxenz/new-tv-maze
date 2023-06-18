"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $('#episodesList')
const NO_IMAGE_AVAILABLE = 'https://timyurl.com/missing-tv'


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get('http://api.tvmaze.com/search/shows', { params: {
    q: term
  }})
  return res.data.map(va => {
    let shows = va.show;
    return {
      id: shows.id,
      name: shows.name,
      summary: shows.summary,
      image: shows.image ? shows.image.medium:  NO_IMAGE_AVAILABLE

    }
  })

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //       "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ];
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src='${show.image}' alt='https://tinyurl.com/tv-missing'
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  return res.data.map(e => {
    return {
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
    }});
}
/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty();
  for(let episode of episodes){
    const $info = 
    (`<li>${episode.name}(${episode.season}, ${episode.number})</li>`);
    $episodesList.append($info)
  }
  $episodesArea.show();

}

async function checkForEpisodesAndDisplay(e) {
const showId = $(e.target).closest('.Show').data('show-id');
const episodes =  await getEpisodesOfShow(showId)
populateEpisodes(episodes);

}

$showsList.on('click', '.Show-getEpisodes', checkForEpisodesAndDisplay)



//reference https://stackoverflow.com/questions/30601620/adding-an-event-listener-to-an-element-that-doesnt-exist-yet-in-vanilla-javascr