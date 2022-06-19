const cardsContainer = document.querySelector(
	".finances-container .finances-container-left .finances-cards"
);
const statusMoney = document.querySelector(
	".finances-container .finances-container-left .status-money"
);
const infos = document.getElementById("infos");
const closeModal = document.getElementById("close-modal");
const inputMonth = document.querySelector("input[name=month]");

const date = new Date();
const currentMonth = String(date.getMonth() + 1).padStart(2, "0");
const currentYear = date.getFullYear();

const form = document.forms[0];
const months = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];
const finances = localStorage.getItem("finances")
	? JSON.parse(localStorage.getItem("finances"))
	: [];
let amountMoney = localStorage.getItem("amountMoney") ? +localStorage.getItem("amountMoney") : 0;
let btnDeletes = document.querySelectorAll(".card .card-actions .action.delete");

while (!amountMoney) {
	amountMoney = +prompt("Quantos reais você tem disponível?");
	localStorage.setItem("amountMoney", amountMoney);
}

function populateCards() {
	finances.forEach(item => {
		cardsContainer.innerHTML += `
      <div class="card" id="card-${item.id}">
        <div class="card-header">
          <h3 class="title">${item.title}</h3>
          <p class="paragraph">${item.month} - ${item.year}</p>
        </div>
        <div class="card-body">
          <img src="./icons/${
						item.type === "capital" ? "up" : "down"
					}-arrow.svg" alt="icon ${
			item.type === "capital" ? "up" : "down"
		} arrow" class="icon-sm">
          <span class="paragraph">
            R$ ${item.money}
          </span>
        </div>
        <div class="card-actions">
          <button class="action delete" data-id="${item.id}">
            <img src="./icons/trash.svg" alt="icon trash" class="icon-sm">
          </button>
        </div>
      </div>
    `;
	});

	btnDeletes = document.querySelectorAll(".card .card-actions .action.delete");
	populateOnclickDelete();
}

function recalculateMoney() {
	statusMoney.innerHTML = `
		<div class="container">
			<img src="./icons/${amountMoney < 0 ? "down" : "up"}-arrow.svg" width="13">
			<h3 class="title">
				R$ ${amountMoney}
			</h3>
		</div>
	`;
}

function handleDelete(id) {
	const removeIndex = finances.findIndex(item => item.id === +id);
	const cardRemove = document.getElementById(`card-${id}`);

	finances.splice(removeIndex, 1);

	if (finances.length <= 0) {
		localStorage.removeItem("finances");
	} else {
		localStorage.setItem("finances", JSON.stringify(finances));
	}

	cardRemove.style.display = "none";
}

function populateOnclickDelete() {
	btnDeletes.forEach(item => {
		item.onclick = () => handleDelete(item.dataset.id);
	});
}

infos.style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
	recalculateMoney();

	if (cardsContainer && finances.length > 0) {
		populateCards();
	}
});

if (form) {
	form.onsubmit = event => {
		event.preventDefault();

		if (
			event.target.title.value.trim() === "" ||
			event.target.type.value.trim() === "" ||
			event.target.money.value.trim() === "" ||
			event.target.month.value.trim() === ""
		) {
			return;
		}

		const month = months[+event.target.month.value.split("-")[1] - 1];
		const year = event.target.month.value.split("-")[0];

		const data = {
			id: localStorage.getItem("finances")
				? JSON.parse(localStorage.getItem("finances"))?.length + 1
				: 1,
			title: event.target.title.value,
			money: event.target.money.value,
			type: event.target.type.value,
			month,
			year
		};

		if (data.type === "capital") {
			amountMoney += parseFloat(data.money);
		} else {
			amountMoney -= parseFloat(data.money);
		}

		localStorage.setItem("amountMoney", amountMoney);
		recalculateMoney();

		event.target.title.value = "";
		event.target.money.value = "";
		event.target.type[0].selected = 1;
		event.target.month.value = "";

		finances.push(data);

		localStorage.setItem("finances", JSON.stringify(finances));

		cardsContainer.innerHTML += `
      <div class="card" id="card-${data.id}">
        <div class="card-header">
          <h3 class="title">${data.title}</h3>
          <p class="paragraph">${data.month} - ${data.year}</p>
        </div>
        <div class="card-body">
          <img src="./icons/${
						data.type === "capital" ? "up" : "down"
					}-arrow.svg" alt="icon ${
			data.type === "capital" ? "up" : "down"
		} arrow" class="icon-sm">
          <span class="paragraph">
            R$ ${data.money}
          </span>
        </div>
        <div class="card-actions">
          <button class="action delete" data-id="${data.id}">
            <img src="./icons/trash.svg" alt="icon trash" class="icon-sm">
          </button>
        </div>
      </div>
    `;

		btnDeletes = document.querySelectorAll(
			".card .card-actions .action.delete"
		);
		populateOnclickDelete();
	};
}

if (inputMonth) {
	inputMonth.onfocus = event => {
		event.target.type = "month";
		event.target.min = `${currentYear}-${currentMonth}`;
	};
}

if (!localStorage.getItem("closeModal")) {
	localStorage.setItem("closeModal", "false");
}

closeModal.onclick = () => {
	localStorage.setItem("closeModal", "true");
	infos.style.display = "none";
};

if (
	!localStorage.getItem("closeModal") ||
	localStorage.getItem("closeModal") === "false"
) {
	infos.style.display = "flex";
} else {
	infos.style.display = "none";
}
// localStorage.clear();
