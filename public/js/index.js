let total = document.querySelectorAll(".total");
let minus = document.querySelectorAll(".minus");
let plus = document.querySelectorAll(".plus");

plus.forEach((btn, i) => {
  btn.addEventListener("click", (evt) => {
    let val = total[i].value;
    val++;
    total[i].value = val;
  });
});

minus.forEach((btn, i) => {
  btn.addEventListener("click", (evt) => {
    let val = total[i].value;
    val--;
    val = val < 0 ? 0 : val;
    total[i].value = val;
  });
});
