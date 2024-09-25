const arr = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21];

function bubbleSort(array) {
    for (let i = 0; i < 10 - 1; i++) {
        for (let j = 0; j < 10 - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                let change = array[j];
                array[j] = array[j + 1];
                array[j + 1] = change;
            }
        }
    }
    return array;
}

console.log(`Array sebelum di sort: ${arr}`);

console.log(`Array setelah di sort: ${bubbleSort(arr)}`);