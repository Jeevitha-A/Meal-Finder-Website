document.addEventListener("DOMContentLoaded", () => {
    const message = "Discover delicious meals and recipes from around the world. Click 'Start' to search for a meal!";
    const typedText = document.getElementById("typedText");
    let index = 0;

    function typeText() {
        if (index < message.length) {
            typedText.textContent += message[index];
            index++;
            setTimeout(typeText, 50); // Adjust typing speed here (in ms)
        }
    }

    typeText();
});
// Transition from front page to main content
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('frontPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
});
document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display meal categories when the page loads
    fetchCategories();
});

function fetchCategories() {
    const items = document.getElementById("items");
    items.innerHTML = "Loading categories...";

    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            items.innerHTML = ""; // Clear loading message
            data.categories.forEach(category => {
                let categoryDiv = document.createElement("div");
                categoryDiv.className = "m-2 singleItem";
                categoryDiv.addEventListener('click', () => fetchMealsByCategory(category.strCategory));

                let categoryInfo = `
                <div class="card" style="width: 12rem;">
                    <img src="${category.strCategoryThumb}" class="card-img-top" alt="${category.strCategory}">
                    <div class="card-body text-center">
                        <center><h5 class="card-text">${category.strCategory}</h5></center>
                    </div>
                </div>
                `;
                categoryDiv.innerHTML = categoryInfo;
                items.appendChild(categoryDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
            items.innerHTML = "There was an error loading categories. Please try again later.";
        });
}

function fetchMealsByCategory(category) {
    const items = document.getElementById("items");
    const detailsContainer = document.getElementById("details");
    items.innerHTML = "Loading meals...";
    detailsContainer.innerHTML = ""; // Clear previous meal details

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            items.innerHTML = ""; // Clear loading message
            data.meals.forEach(meal => {
                let mealDiv = document.createElement("div");
                mealDiv.className = "m-2 singleItem";
                mealDiv.addEventListener('click', () => details(meal.idMeal));

                let mealInfo = `
                <div class="card" style="width: 12rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body text-center">
                        <center><h5 class="card-text">${meal.strMeal}</h5></center>
                    </div>
                </div>
                `;
                mealDiv.innerHTML = mealInfo;
                items.appendChild(mealDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
            items.innerHTML = "There was an error loading meals. Please try again later.";
        });
}
document.getElementById("button").addEventListener('click', () => {
    let inputValue = document.getElementById('inputName').value.trim();
    let detailsContainer = document.getElementById("details");
    detailsContainer.innerHTML = ""; // Clear previous details

    if (!inputValue) {
        alert("Please enter a meal name to search.");
        return;
    }

    // Show loading message
    const loadingMessage = document.createElement("div");
    loadingMessage.innerHTML = "Loading...";
    loadingMessage.className = "loading"; // Add a class for styling
    detailsContainer.appendChild(loadingMessage);

    // Fetch meals based on input value
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            const items = document.getElementById("items");
            items.innerHTML = ""; // Clear previous results
            detailsContainer.removeChild(loadingMessage); // Remove loading message

            if (data.meals == null) {
                document.getElementById("msg").style.display = "block";
            } else {
                document.getElementById("msg").style.display = "none";
                
                data.meals.forEach(meal => {
                    let itemDiv = document.createElement("div");
                    itemDiv.className = "m-2 singleItem";
                    itemDiv.addEventListener('click', () => details(meal.idMeal));

                    let itemInfo = `
                    <div class="card" style="width: 12rem;">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body text-center">
                                    <center><h5 class="card-text">${meal.strMeal}</h5></center>
                        </div>
                    </div>
                    `;
                    itemDiv.innerHTML = itemInfo;
                    items.appendChild(itemDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert("There was an error fetching data. Please try again later.");
        });
});

function details(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(detail => {
            let meal = detail.meals[0];
            console.log(meal); // Log meal data for debugging
            let detailsContainer = document.getElementById("details");
            detailsContainer.innerHTML = ""; // Clear previous details

            // Split instructions into sentences and handle empty instructions
            let instructions = meal.strInstructions ? meal.strInstructions.split('.').filter(Boolean) : ["No instructions available."];
            let ingredientsList = [];
            for (let i = 1; i <= 5; i++) {
                let ingredient = meal[`strIngredient${i}`];
                if (ingredient) {
                    ingredientsList.push(`<li>${ingredient}</li>`);
                }
            }

            // Generate HTML for meal details
            let detailsInfo = `
            <div class="card" style="width: 19rem;">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                  <center><h3 class="card-text">${meal.strMeal}</h3></center>
                    <h6>INGREDIENTS</h6>
                    <ul style="list-style-type: none; padding: 0;">
                        <li>Area: ${meal.strArea}</li>
                        <li>Category: ${meal.strCategory}</li>
                        ${ingredientsList.join('')}
                    </ul>
                    <h6>INSTRUCTIONS</h6>
                    <p>${instructions.map(sentence => sentence.trim() + '.<br><br>').join('')}</p>
                    <h6>Tutorial Video</h6>
                    <a href="${meal.strYoutube}" target="_blank" class="btn btn-primary">Watch on YouTube</a>
                </div>
            </div>
            `;
        
            let detailsDiv = document.createElement("div");
            detailsDiv.innerHTML = detailsInfo;
            detailsContainer.appendChild(detailsDiv);
             // Scroll to the details section
             detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        
        .catch(error => {
            console.error('Error fetching meal details:', error);
            alert("There was an error fetching meal details. Please try again later.");
        });
}
