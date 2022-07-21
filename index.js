const db = new Dexie("shoppingApp");
db.version(1).stores({ items: "++id,name,price,isPurchased" });

const itemForm = document.getElementById("item-form");
const itemDiv = document.getElementById("itemsDiv");
const totalPriceDiv = document.getElementById("totalPriceDiv");

const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray();

  itemDiv.innerHTML = allItems.map(
    (item) => `
        
    <div class="item ${item.isPurchased && 'purchased'} ">
    <label>
        <input 
        type="checkbox" 
        class="checkbox"
        onchange="toggleItemStatus(event, ${item.id})"
        ${item.isPurchased && 'checked'}
        >
    </label>

    <div class="itemInfo">
        <p>${item.name}</p>
        <p>${item.PriceInput} X ${item.QuantityInput}</p>
    </div>
  
    <button class="deleteButton" onclick="removeItem(${item.id})">
    X
    </button>
</div>
    `
  ).join('')
  
const arrayOfprices = allItems.map(item => item.PriceInput * item.QuantityInput)
const totalPrice = arrayOfprices.reduce((a,b) => a + b, 0)
  
totalPriceDiv.innerText = 'Total price: $' + totalPrice

};

window.onload = populateItemsDiv


itemForm.onsubmit = async () => {
  event.preventDefault();

  const name = document.getElementById("NameInput").value;
  const QuantityInput = document.getElementById("QuantityInput").value;
  const PriceInput = document.getElementById("PriceInput").value;

  // submit to indexdb
  await db.items.add({ name, QuantityInput, PriceInput });

  await populateItemsDiv()    

  itemForm.reset();
}
  const toggleItemStatus = async (event, id) => {
    await db.items.update(id, { isPurchased: !!event.target.checked }) 
    await populateItemsDiv()
  }

const removeItem = async (id) => {
    await db.items.delete(id)
    await populateItemsDiv() 
}