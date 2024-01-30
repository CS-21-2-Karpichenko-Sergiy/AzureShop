const { json } = require("body-parser");

const get_categories = ({category}) => {
    let data = ""
    if(category) data = category
    fetch('http://localhost:3500/ListCategories', {body: JSON.stringify(data)})
    .then(response => response.json())
    .then(categories => {
        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = "";
        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.textContent = category.name;
            listItem.addEventListener("click", (listItem) => get_categories)
            categoryList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));

}


const get_goods = (good) => {
    fetch('http://localhost:3500/goods')
    .then(response => response.json())
    .then(goods => {    
    })
    .catch(error => console.error('Error fetching goods:', error));
}

window.onload=function(){
    get_categories()
}

