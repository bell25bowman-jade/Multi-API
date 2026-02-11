// wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // get references to DOM elements
  const getDogImageBtn = document.getElementById("get-dog-image");
  const dogImageContainer = document.getElementById("dog-image-container");

  // function to fetch random dog image from Dog CEO API
  function getRandomDogImage() {
    fetch("https://dog.ceo/api/breeds/image/random")
    const data = await response.json();
    const imageUrl = data.message;
    //append image to container
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Random Dog";
    dogImageContainer.appendChild(img);
  }
  console.log("Script loaded successfully.");