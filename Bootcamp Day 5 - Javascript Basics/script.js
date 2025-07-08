const user = {
    name: prompt("İsminiz nedir?"),
    age: Number(prompt("Yaşınız nedir?")),
    job: prompt("Mesleğiniz nedir?")
}; 

console.log("Kullanıcı bilgileri: ", user);

let cart = []

function addProduct(name, price){
    while(true){
        const name = prompt("Sepete eklemek istediğiniz ürünün adı (bitirmek için boş bırakın):")
        if (name === null || name == "") {
            console.log("Ürün ekleme işi sona erdi.");
            break;
        }

        const price = Number(prompt("Ürünün fiyatı (TL):"))
    
        if (price === null || price <= 0) {
            console.log("Geçerli bir fiyat girin.");
            continue;
        }

        cart.push({name, price});
        console.log(name, " sepete eklendi.")
    }
}

function listCart() {
    if (cart.length == 0) {
        console.log("Sepetiniz boş.")
    }
    else {
        console.log("Sepetinizdeki ürünler:")
         cart.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price} TL`);
        });

        let totalPrice = cart.reduce((total, product) => total + product.price, 0);

        console.log("Sepetin toplam fiyatı: ", totalPrice, "TL");
        
    }
}

function removeProduct() {
    while (true) {
        if (cart.length == 0){
            break;
        }
        
        index = Number(prompt("Silmek istediğiniz ürünün listedeki indeks değerini girin (bitirmek için boş bırakın)"));
        if (index == "")
        {
            console.log("Ürün silme işlemi bitti.");
            listCart();
            break;
        }
        else if (index > 0 && index <= cart.length){
            index -= 1;
            const removed = cart.splice(index, 1);
            console.log(removed[0].name, " sepetten çıkarıldı.")
            listCart();
            continue;
        }   
        else {
            console.log("Geçersiz indeks girdiniz.")
            continue;
        }
    }
}

addProduct();

listCart();

removeProduct();