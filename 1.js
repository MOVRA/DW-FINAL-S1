/* Buatlah sebuah function yang bertujuan untuk menghitung harga barang berdasarkan kualitasnya, dengan parameter kualitas barang dan quantity :
Kentuan : 
- Kualitas Barang A, Harga 4550, Jika Qty Pembelian diatas 13 mendapat potongan 231/qty
- Kualitas Barang B, Harga 5330, Jika Qty pembelian diatas 7 akan mendapatkan potongan 23%
- Kualitas Barang C, Harga 8653, Tidak ada promo untuk barang ini 
Clue : maka jika function dijalankan :
Hitungbarang(A, 14)
Output :  
Total harga barang : 63700
Potongan : 3234
Total yang harus dibayar : 60466
*/

// Print hasil
function print(harga, hargaPotongan = null, potongan = null) {
    console.log(`Total harga barang: ${harga}`);
    console.log(`Potongan: ${potongan ? potongan : "Tidak ada potongan"}`);
    console.log(`Total yang harus dibayar: ${hargaPotongan ? hargaPotongan : harga}`);
}

// Menghitung harga dari jumlah barang 
function hitungBarang(barang, jumlahBarang) {

    let hitungHarga;
    let hargaSetelahPotongan;
    let hargaTerpotong;

    if (barang.toUpperCase() == "A") {
        let hargaA = 4550;
        if (jumlahBarang > 13) {
            hitungHarga = jumlahBarang * hargaA;
            hargaSetelahPotongan = jumlahBarang * (hargaA - 231);
            hargaTerpotong = hitungHarga - hargaSetelahPotongan;
            print(hitungHarga, hargaSetelahPotongan, hargaTerpotong);
        }
        else {
            hitungHarga = jumlahBarang * hargaA;
            print(hitungHarga);
        }
    }
    else if (barang.toUpperCase() == "B") {
        let hargaB = 5330;
        if (jumlahBarang > 7) {
            hitungHarga = jumlahBarang * hargaB;
            hargaTerpotong = (23 / 100) * hitungHarga;
            hargaSetelahPotongan = hitungHarga - hargaTerpotong;
            print(hitungHarga, hargaSetelahPotongan, hargaTerpotong);
        }
        else {
            hitungHarga = jumlahBarang * hargaB;
            print(hitungHarga);
        }

    }
    else if (barang.toUpperCase() == "C") {
        let c = 8653;
        hitungHarga = jumlahBarang * c;
        print(hitungHarga);
    }
}

hitungBarang("A", 14);