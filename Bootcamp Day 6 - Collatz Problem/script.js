while (true) {
    let startNumber = 1;
    const upperLimit = Number(prompt("Üst limiti giriniz (çıkış için 0 girebilirsiniz):"));
    if (upperLimit === null || upperLimit === "") {
        alert("Lütfen geçerli bir üst limit girin.");
        continue;
    }
    else if (upperLimit === 0) {
        alert("Çıkış yapıldı!   ")
        break;
    }

    let maxLength = 1;

    for (let i = startNumber; i < upperLimit; i++) {
        let tempI = i;
        let length = 1;
        while (tempI !== 1) {
            if (tempI % 2 == 0) {
                tempI = tempI / 2;
            }
            else {
                tempI = 3 * tempI + 1;
            }
            length++;
        }

        console.log("-----------------------")
        console.log("Denenen sayı: ", i);
        console.log("Zincir uzunluğu: ", length)

        if (length > maxLength) {
            startNumber = i;
            maxLength = length;
        }
    }

    alert(`En uzun zinciri üreten değer: ${startNumber} \n En uzun zincir uzunluğu: ${maxLength}`);
}