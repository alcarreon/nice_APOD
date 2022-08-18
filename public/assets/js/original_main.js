const addThem = document.querySelectorAll(".fa-heart");

Array.from(addThem).map((x) => {
  x.addEventListener("click", makeFave);
});

async function makeFave() {
  theUrl = this.parentNode.querySelector("img").src;
  console.log(theUrl);

  //   fetch request
  try {
    const response = await fetch("/fav", {
      // method can be either PUT, GET, POST, DELETE
      method: "put",
      //   headers specify that we are using json
      headers: { "Content-Type": "application/json" },
      //   body of the json
      body: JSON.stringify({
        // takes the form of {key : value}
        hdurl: theUrl,
      }),
    });
  } catch (err) {
    console.log(err);
  }
}

const removeThem = document.querySelectorAll(".fa-thumbs-down");

Array.from(removeThem).map((x) => {
  x.addEventListener("click", removeFave);
});

async function removeFave() {
  theUrl = this.parentNode.querySelector("img").src;
  console.log(theUrl);

  //   fetch request
  try {
    const response = await fetch("/removefav", {
      // method can be either PUT, GET, POST, DELETE
      method: "put",
      //   headers specify that we are using json
      headers: { "Content-Type": "application/json" },
      //   body of the json
      body: JSON.stringify({
        // takes the form of {key : value}
        hdurl: theUrl,
      }),
    });
  } catch (err) {
    console.log(err);
  }
}
