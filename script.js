const searchBar = document.querySelector(".search-bar");
const results = document.querySelector(".results");
const details = document.querySelector(".details");
const fav = document.querySelector(".fav");

let counter = 1;

//Getting meals list from first letter
searchBar.addEventListener("input", async (e) => {
    const value = e.target.value.toLowerCase();
    const firstLetter = value[0];

    results.textContent = "";

    if (value.length === 0) {
        results.style.display = "none";
        return;
    }

    //fetching data using API
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`
    );

    const data = await response.json();

    let limit = 1;

    //limiting the no. of meals to 10 to be shown on screen
    for (let meal of data.meals) {
        if (limit > 10) {
            break;
        }
        limit++;

        const name = meal.strMeal.toLowerCase();

        if (name.includes(value)) {
            const li = document.createElement("li");
            li.textContent = meal.strMeal;
            results.appendChild(li);
        }
    }

    //show search results only if it is greater than 0
    if (results.children.length > 0) {
        results.style.display = "flex";
    } else {
        results.style.display = "none";
    }
});

//event listener for searched results
results.addEventListener("click", async (e) => {
    details.style.display = "grid";

    const food = e.target.textContent;

    //search API with food
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`
    );

    const data = await response.json();

    details.textContent = "";

    //creating image element
    const image = document.createElement("img");
    image.className = "image";
    image.src = data.meals[0].strMealThumb;

    const title = document.createElement("div");
    title.className = "title";

    //creating title element
    const text = document.createElement("div");
    text.className = "text";
    text.textContent = data.meals[0].strMeal;

    const name = data.meals[0].strMeal;

    //favourites icon
    const icon = document.createElement("img");
    let flag = false;

    //checing the local storage for the meal name, if its present or not
    for (let i = 0; i < window.localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))) == name) {
            //if present
            flag = true;
            break;
        }
    }

    if (!flag) {
        icon.src = "./images/star-unfilled.svg";
    } else {
        icon.src = "./images/star-filled.svg";
    }

    icon.className = "icon";

    title.appendChild(text);
    title.appendChild(icon);

    //creating instructions element
    const ins = document.createElement("div");
    ins.className = "instructions";
    ins.textContent = data.meals[0].strInstructions;

    details.appendChild(image);
    details.appendChild(title);
    details.appendChild(ins);

    searchBar.value = "";
    results.style.display = "none";

    //event listener for favourites button
    icon.addEventListener("click", (e) => {
        const meal = e.target.parentElement.firstChild.textContent;

        let flag = false;
        let key;

        //searching in local storage
        for (let i = 0; i < window.localStorage.length; i++) {
            if (JSON.parse(localStorage.getItem(localStorage.key(i))) == meal) {
                flag = true;
                key = i;
                break;
            }
        }

        //added to favourites
        if (!flag) {
            icon.src = "./images/star-filled.svg";
            window.localStorage.setItem(counter, JSON.stringify(meal));
            counter++;
        } else {
            icon.src = "./images/star-unfilled.svg";
            window.localStorage.removeItem(localStorage.key(key));
        }
    });
});

//reloading the Favourites
function reloadFav() {
    details.textContent = "";

    const title = document.createElement("div");
    title.className = "favTitle";
    title.textContent = "Favourites";

    details.appendChild(title);

    //printing all the elements in local storage
    for (let i = 0; i < window.localStorage.length; i++) {
        const name = JSON.parse(localStorage.getItem(localStorage.key(i)));

        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        const button = document.createElement("img");
        button.className = "delBtn";
        button.src = "./images/cancel.svg";

        const ele = document.createElement("div");
        ele.className = "favMeals";
        ele.textContent = name;

        wrapper.appendChild(ele);
        wrapper.appendChild(button);
        details.appendChild(wrapper);
    }
}

//favorites tab
fav.addEventListener("click", () => {
    // console.log(details.children);
    details.style.display = "flex";
    reloadFav();
});

//delete button in favorites
details.addEventListener("click", (e) => {
    const classBtn = e.target.className;

    if (classBtn !== "delBtn") {
        return;
    }

    const food = e.target.parentElement.children[0].textContent;

    let key;

    //looping through local storage for finding the element
    for (let i = 0; i < window.localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))) == food) {
            key = i;
            break;
        }
    }

    window.localStorage.removeItem(localStorage.key(key));

    reloadFav();
});
