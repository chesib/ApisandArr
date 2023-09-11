console.log("holamundo");
const priceInput = document.querySelector("#priceIn");
const coin = document.querySelector("#coinIn");
const btn = document.querySelector("#btnBuscar");
const resultDiv = document.querySelector("#totalOut");
let usdVle = document.querySelector("#valueUsd");
let eurVle = document.querySelector("#valueEur");

let data = {};
const getMoneyValue = async () => {
	try {
		const res = await fetch(`https://mindicador.cl/api/`);
		const json = await res.json();
		data = json;
	} catch (error) {
		console.log("error");
		resultDiv.innerHTML = "no carga la libreria";
	}
};
const calculateTotal = () => {
	btn.addEventListener("click", () => {
		const clpAmount = parseFloat(priceInput.value);
		const selectedCurrency = coin.value;

		if (isNaN(clpAmount)) {
			resultDiv.textContent = "Monto ingresado no valido";
			return;
		}
		let convertedAmount = 0;
		if (selectedCurrency === "usd") {
			convertedAmount = clpAmount / data.dolar.valor;
		} else if (selectedCurrency === "eur") {
			convertedAmount = clpAmount / data.euro.valor;
		} else {
			resultDiv.textContent = "error en moneda seleccionada ";
			return;
		}

		resultDiv.innerHTML = `
        ${clpAmount} CLP es aproximadamente:<br>
        ${convertedAmount.toFixed(2)} ${selectedCurrency.toUpperCase()}
        `;
	});
};
const getDolarGraf = async () => {
	try {
		const resDolar = await fetch(`https://mindicador.cl/api/dolar`);
		const jsonDolar = await resDolar.json();
		dataDolar = jsonDolar;
	} catch (error) {
		console.log("errrordatadolar");
	}
	const serieArr = dataDolar.serie.slice(-10);

	const fechas = serieArr.map((objeto) => objeto.fecha);
	const valores = serieArr.map((obj) => obj.valor);
	console.log(fechas);
	console.log(valores);
	const options = {
		series: [
			{
				name: "Valor en clp",
				data: valores,
			},
		],
		chart: {
			height: 350,
			type: "line",
			zoom: {
				enabled: false,
			},
		},
		dataLabels: {
			enabled: true,
		},
		stroke: {
			curve: "straight",
		},
		title: {
			text: "Dolar price in Clp last 10 days",
			align: "left",
		},
		grid: {
			row: {
				colors: ["skyblue", "transparent"], // takes an array which will be repeated on columns
				opacity: 0.5,
			},
		},
		xaxis: {
			categories: fechas,
		},
	};
	const chart = new ApexCharts(document.querySelector("#chart"), options);
	chart.render();
};
const init = async () => {
	await getMoneyValue();
	await console.log(data);
	calculateTotal();
	await getDolarGraf();
};

init();
