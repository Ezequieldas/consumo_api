const api = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
});
api.defaults.headers.common["X-API-KEY"] =
  "live_8gHhNnHcKvGHMPY6ZNwWAfwgLmZBHqLCQ3qOs34gTgUkYdhPjd3s4WdkemXBMLI8";

const API_URL_RANDOM =
  "https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_8gHhNnHcKvGHMPY6ZNwWAfwgLmZBHqLCQ3qOs34gTgUkYdhPjd3s4WdkemXBMLI8";

const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";

const API_URL_FAVORITES_DELETE = (id) =>
  `https://api.thecatapi.com/v1/favourites/${id}`;

const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const spanError = document.getElementById("error");

async function loadRandomCats() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error en la solicitud: " + res.status;
  } else {
    const img = document.getElementById("img");
    const img2 = document.getElementById("img2");
    const btn1 = document.getElementById("btn1");
    const btn2 = document.getElementById("btn2");

    img.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavoriteCat(data[0].id);
    btn2.onclick = () => saveFavoriteCat(data[1].id);
  }
}

async function loadFavoriteCats() {
  const res = await fetch(API_URL_FAVORITES, {
    method: "GET",
    headers: {
      "X-API-KEY":
        "live_8gHhNnHcKvGHMPY6ZNwWAfwgLmZBHqLCQ3qOs34gTgUkYdhPjd3s4WdkemXBMLI8",
    },
  });
  const data = await res.json();

  console.log("favorites");
  console.log(data);

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error en la solicitud: " + res.status;
  } else {
    const section = document.getElementById("favoriteCats");
    section.innerHTML = "";
    const h2 = document.createElement("h2");
    const h2Text = document.createTextNode("Favoritos");
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach((cat) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("Quitar al gatico de favoritos");

      img.src = cat.image.url;
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavoriteCat(cat.id);
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
      btn.setAttribute("class", "btn");
    });
  }
}

async function saveFavoriteCat(id) {
  const { data, status } = await api.post("/favourites", {
    image_id: id,
  });

  // const res = await fetch(API_URL_FAVORITES, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     'X-API-KEY': 'live_8gHhNnHcKvGHMPY6ZNwWAfwgLmZBHqLCQ3qOs34gTgUkYdhPjd3s4WdkemXBMLI8'
  //   },
  //   body: JSON.stringify({
  //     image_id: id
  //   }),
  // });

  // const data = await res.json();

  console.log("Save");

  if (status !== 200) {
    spanError.innerHTML = "Hubo un error en la solicitud: " + status;
  } else {
    console.log("Gatico guardado en favoritos");
    loadFavoriteCats();
  }
}

async function deleteFavoriteCat(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY":
        "live_8gHhNnHcKvGHMPY6ZNwWAfwgLmZBHqLCQ3qOs34gTgUkYdhPjd3s4WdkemXBMLI8",
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error en la solicitud: " + res.status;
  } else {
    console.log("Gatico borrado de favoritos");
    loadFavoriteCats();
  }
}

async function uploadCatPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);

  console.log(formData.get("file"));

  const res = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: {
      // 'Content-Type': 'multipart/form-data',
      "X-API-KEY": "c08d415f-dea7-4a38-bb28-7b2188202e46",
    },
    body: formData,
  });
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.log({ data });
  } else {
    console.log("Foto de michi subida :)");
    console.log({ data });
    console.log(data.url);
    saveFavoriteCat(data.id);
  }
}

loadRandomCats();
loadFavoriteCats();
