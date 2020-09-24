// const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const lyrics = document.getElementById('lyrics');
const more = document.getElementById('more');
var lookup = new Map();

const apiURL = 'https://api.lyrics.ovh';

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class="playlist">
      ${data.data
        .map(
          song =>{ 
            return `<li 
                        class="song" onclick="getLyrics('${song.artist.name.replace("'","\'")}', '${song.title.replace("'","\'")}')" tabindex="0">
                        <img src="${song.album.cover}">
                        <main>${song.title}</main>
                        <section>${song.artist.name}</section>
                    </li>`
        }).join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')"><i class="fa fa-backward" aria-hidden="true""></i></button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')"><i class="fa fa-forward" aria-hidden="true""></i></button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  more.innerHTML = '';
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

   if (data.error || !data.lyrics) {
        lyrics.innerHTML = `<h2>Sorry no lyrics found<h2>`;
        lyrics.innerHTML += `<img class="no-data" src = "./assets/no-data.svg"></img>`;
   } else {
        const formattedLyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        lyrics.innerHTML = `
            <h2>${songTitle}</h2>
            <h2>-${artist}</h2>
            <span>${formattedLyrics}</span>
        `;
  }

  lyrics.innerHTML += `<h3>Here are some more songs of ${artist}</h3>`;
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

  more.innerHTML = '';
}

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;
  const artist = clickedEl.getAttribute('data-artist');
  const songTitle = clickedEl.getAttribute('data-songtitle');

  if (clickedEl.tagName === 'BUTTON') {
    getLyrics(artist, songTitle);
  }

  searchSongs(artist);

});

const searchInput = document.querySelector('input');

searchInput.addEventListener('keyup',searchItem);

function searchItem(e) {
  lyrics.innerHTML = "";
  if (e.keyCode == 13)
    searchSongs();
  else
    setTimeout(searchSongs, 500);


}

async function searchSongs(songName) {
  const searchString = songName ? songName :searchInput.value.trim();
  if (!searchString.length) 
    return;

  if(!lookup.has(searchString)){
      const res = await fetch(`${apiURL}/suggest/${searchString}`);
      songs = await res.json();
      lookup.set(searchString, songs)
  }

  showData(lookup.get(searchString));

}
