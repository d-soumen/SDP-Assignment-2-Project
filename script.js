
let currentDrinks = [];
const load_drinks=()=>{
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    .then(res=>res.json())
    .then(data=>{
        currentDrinks = data.drinks || [];
        displaydrinks(currentDrinks);

    });
};

const displaydrinks=(drinks)=>{
    const drinkscontainer=document.getElementById("drink-list");

    if (!drinks){
        drinkscontainer.innerHTML=`<p style="grid-column:1/-1;text-align:center;">No drinks found</p>`;
        return;
    }
    drinkscontainer.innerHTML="";
    drinks.forEach(drink=>{
        const div=document.createElement("div");
        div.classList.add("drink");
        div.innerHTML = `
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <p><strong>Name:</strong> ${drink.strGlass}</p>
            <p><strong>Category:</strong> ${drink.strCategory}</p>
            <p><strong>Instructions:</strong> ${drink.strInstructions.slice(0,15)}...</p>
            <div class="button-group">
            <button onclick="handleAddToCart('${drink.idDrink}','${drink.strDrink}','${drink.strDrinkThumb}')"
                ${cart.some(c => c.id === drink.idDrink) ? 'disabled class="btn btn-disabled"' : 'class="btn btn-add"'} >
                ${cart.some(c => c.id === drink.idDrink) ? 'Already Selected' : 'Add to cart'}
            </button>
            <button class="btn-details" onclick="singleDrink('${drink.idDrink}')">Details</button>
            </div>
        `;
        drinkscontainer.appendChild(div);
    }) 
}
let cart=[];
const handleAddToCart = (id, name, img) => {
    if (cart.length >= 7) {
        alert("You cannot add more than 7 drinks!");
        return;
    }
    if (cart.some(item => item.id === id)) return;

    cart.push({ id, name, img });
    updateCart();
    
    const searchValue = document.getElementById("search-item").value.trim();
    if (searchValue) {
        loadSearchDrinks(searchValue); 
    } else {
        displaydrinks(currentDrinks); 
    }
};
const updateCart = () => {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${item.img}" ></td>
                <td>${item.name}</td>
            </tr>
        `;
        cartContainer.innerHTML += row;
    });
    document.getElementById("cart-count").innerText = cart.length;
};

const singleDrink = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
        const drink = data.drinks[0];
        document.getElementById("drinkModalLabel").innerText = drink.strDrink;
        document.getElementById("modalImage").src = drink.strDrinkThumb;
        document.getElementById("modalCategory").innerText = drink.strCategory;
        document.getElementById("modalAlcoholic").innerText = drink.strAlcoholic;
        document.getElementById("modalGlass").innerText = drink.strGlass;
        document.getElementById("modalInstructions").innerText = drink.strInstructions;
        document.getElementById("modalTags").innerText = drink.strTags || "No tags";

        // Show Bootstrap modal
        const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
        modal.show();
    });
};

const loadSearchDrinks = (query) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => displaydrinks(data.drinks));
};

// document.getElementById("closeModal").onclick = () => {
//     document.getElementById("drinkModal").style.display = "none";
// };
// window.onclick = (e) => {
//     if (e.target === document.getElementById("drinkModal")) {
//         document.getElementById("drinkModal").style.display = "none";
//     }
// };


document.getElementById("search-button").addEventListener("click", () => {
    loadSearchDrinks(document.getElementById("search-item").value);
});

load_drinks();