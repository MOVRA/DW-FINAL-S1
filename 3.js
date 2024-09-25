function drawPattern(num) {
    if (num % 2 == 0) {
        console.log("Please input an odd number!");
        return;
    }
    for (let i = 1; i <= num; i++) {
        let rectangle = "";
        for (let j = 1; j <= num; j++) {
            let middle = (i == Math.floor(num / 2) + 1 && j != Math.floor(num / 2) + 1) || (j == Math.floor(num / 2) + 1 && i != Math.floor(num / 2) + 1);
            let isCorner = (i == 1 || i == num) && (j == 1 || j == num);
            if (middle || isCorner) {
                rectangle += "* "
            }
            else {
                rectangle += "# "
            }
        }
        console.log(rectangle);
    }
}
drawPattern(5);