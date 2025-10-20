const PRIMARY_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "EUR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "NPR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag image when currency changes
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const swapIcon = document.querySelector(".dropdown i");

swapIcon.addEventListener("click", () => {
  // Swap selected currency values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Trigger conversion again automatically (optional)
  btn.click();
});


// Fetch and display exchange rate
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  let URL = `${PRIMARY_URL}/${fromCurr.value.toLowerCase()}.json`;
  let response;

  try {
    response = await fetch(URL);
    if (!response.ok) throw new Error("Primary API failed");
  } catch (error) {
    console.warn("Primary API failed, switching to fallback...");
    URL = `${FALLBACK_URL}/${fromCurr.value.toLowerCase()}.json`;
    response = await fetch(URL);
  }

  const data = await response.json();
  const baseData = data[fromCurr.value.toLowerCase()];
  const rate = baseData[toCurr.value.toLowerCase()];

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
});
