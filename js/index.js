let movies = [];

fetch("https://japceibal.github.io/japflix_api/movies-data.json")
  .then((data) => data.json())
  .then((moviesData) => (movies = moviesData))
  .catch((error) => console.log(error));

const input = document.getElementById("inputBuscar");
const button = document.getElementById("btnBuscar");
const container = document.getElementById("lista");

const generateStars = (rating) => {
  const totalStars = 5;
  let fullStars = Math.floor(rating);
  const decimalPart = rating % 1; // Parte decimal del rating

  // Si el decimal es >= 0.4 y < 0.9, se añade media estrella
  const halfStar = decimalPart >= 0.4 && decimalPart < 0.9 ? 1 : 0;

  // Si el decimal es mayor o igual a 0.9, se añade una estrella completa extra
  if (decimalPart >= 0.9) {
    fullStars++;
  }

  const emptyStars = totalStars - fullStars - halfStar;

  return `${'<i class="bi bi-star-fill"></i>'.repeat(fullStars)}
          ${halfStar ? '<i class="bi bi-star-half"></i>' : ""}
          ${'<i class="bi bi-star"></i>'.repeat(emptyStars)}`;
};

button.addEventListener("click", () => {
  container.innerHTML = '';
  const searchText = input.value.toLowerCase();
  
  const filteredMovies = movies.filter((movie) => {
    const genreMatch = movie.genres.some((genre) => {
      return genre.name.toLowerCase().includes(searchText);
    });

    return (
      movie.title.toLowerCase().includes(searchText) ||
      genreMatch ||
      movie.tagline.toLowerCase().includes(searchText) ||
      movie.overview.toLowerCase().includes(searchText)
    );
  });

  filteredMovies.map((movie) => {
    console.log(movie);
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="card bg-dark border-light mb-3" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
            <div class="card-body text-light d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text text-muted">${movie.tagline}</p>
                </div>
                <div class="d-flex">${generateStars(movie.vote_average / 2)}</div>
            </div>
        </div>
    `;
    container.appendChild(li);
    container.innerHTML += `<div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
      <div class="offcanvas-header">
        <h4 class="offcanvas-title" id="offcanvasTopLabel">${movie.title}</h4>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p>${movie.overview}</p>
        <hr class="border border-dark">
        <footer class="d-flex justify-content-between">
          <p class="text-muted">
            ${movie.genres.map(genre => genre.name).join(' - ')}
          </p>
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              More
            </button>
            <ul class="dropdown-menu dropdown-menu-dark position-fixed ">
              <li><p class="dropdown-item-text">Year: ${movie.release_date.slice(0, -6)}</p></li>
              <li><p class="dropdown-item-text">Runtime: ${movie.runtime} mins</p></li>
              <li><p class="dropdown-item-text">Budget: $${movie.budget}</p></li>
              <li><p class="dropdown-item-text">Revenue: $${movie.revenue}</p></li>
            </ul>
          </div>    
        </footer>
      </div>
    </div>`
  });
});
