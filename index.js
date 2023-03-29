const menuItems = document.getElementById("menu-items")
const dishImage = document.getElementById("dish-image")
const dishName = document.getElementById("dish-name")
const dishDescription = document.getElementById("dish-description")
const dishPrice = document.getElementById("dish-price")
const cartForm = document.getElementById("cart-form")
const numberInCart = document.getElementById("number-in-cart")
const totalCostObject = document.getElementById("total-cost")
let currentItem

cartForm.addEventListener("submit" , addToCart)

fetch("http://localhost:3000/menu")
.then(response => response.json())
.then(data => {
    data.forEach(createMenu)
    displayMenuItem(data[0])
})

fetch("http://localhost:3000/money")
.then(response => response.json())
.then(data => {
    totalCostObject.textContent = data.total_cost
})

function createMenu(menuItem){
    const span = document.createElement("span")
    span.textContent = menuItem.name
    menuItems.append(span)
    span.addEventListener("click" , () => displayMenuItem(menuItem))
}

function displayMenuItem(menuItem){
    numberInCart.textContent = menuItem.number_in_bag
    currentItem = menuItem
    dishImage.src = menuItem.image
    dishName.textContent = menuItem.name
    dishDescription.textContent = menuItem.description
    dishPrice.textContent = menuItem.price
}

function addToCart(event){
    event.preventDefault()
    let cartCost = 0
    const itemCost = currentItem.price
    let moreFoodPls = event.target.children[0].value
    let totalCost = parseInt(totalCostObject.textContent)
    moreFoodPls = parseInt(moreFoodPls)
    cartCost = itemCost * moreFoodPls
    totalCost += cartCost
    totalCostObject.textContent = totalCost
    currentItem.number_in_bag += moreFoodPls
    numberInCart.textContent = currentItem.number_in_bag
    event.target.reset()

    fetch(`http://localhost:3000/menu/${currentItem.id}` , {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({number_in_bag: currentItem.number_in_bag})
    })

    fetch("http://localhost:3000/money" , {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({total_cost: totalCost})
    })
}
