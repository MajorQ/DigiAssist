const myArray = [1, 2, 3, 4]
const newArray = myArray.map((element: number) => {
    return element * 2;
})
console.log(myArray);
console.log(newArray);