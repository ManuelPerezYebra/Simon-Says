import cero from 'https://github.com/ManuelPerezYebra/Simon-Says/blob/main/docs/assets/1.mp3';
import first from 'https://github.com/ManuelPerezYebra/Simon-Says/blob/main/docs/assets/2.mp3';
import second from 'https://github.com/ManuelPerezYebra/Simon-Says/blob/main/docs/assets/3.mp3';
import third from 'https://github.com/ManuelPerezYebra/Simon-Says/blob/main/docs/assets/4.mp3';

const startButtonElement = document.getElementById('startbutton');

const playerChoiceContainer = document.getElementById('gameContainer');
const pointsCounter = document.getElementById('points');
const audio = document.getElementById('audio');
const round = document.getElementById('roundCounter');
const pcChoice = [];
let playerChoice = [];
let roundCounter = 0;
let gameActive = false;
let points = 0;

const GAME_SOUND = {
	0: cero,
	1: first,
	2: second,
	3: third
};
const startGame = () => {
	startButtonElement.disabled = true;
	console.log('El juego ha comenzado');
	gameActive = true;
	nextRound();
	roundShow();
};

const playerChoiceElement = event => {
	if (!gameActive) return;
	const value = event.target.dataset.id;
	playSound(value);

	if (playerChoice.length < pcChoice.length) {
		playerChoice.push(value);
		checkResults();
		const colorIndex = parseInt(value);
		const colorElement = playerChoiceContainer.children[colorIndex];
		colorElement.classList.add('selected');

		// Retira la clase 'selected' después de un breve tiempo
		setTimeout(() => {
			colorElement.classList.remove('selected');
		}, 500);
	}
};
const pcChoiceElement = () => {
	let index = 0; // Variable para rastrear el índice de la secuencia a reproducir

	// Función para reproducir la secuencia almacenada en pcChoice
	const playPreviousChoices = () => {
		if (index < pcChoice.length) {
			const colorIndex = parseInt(pcChoice[index]);
			const colorElement = playerChoiceContainer.children[colorIndex];
			playSound(colorIndex);
			colorElement.classList.add('selected');
			setTimeout(() => {
				colorElement.classList.remove('selected');
				index++;
				playPreviousChoices(); // Llama recursivamente para reproducir el siguiente color
			}, 1000); // Retira la clase 'selected' después de 0.5 segundos
		} else {
			// Una vez que se haya reproducido toda la secuencia anterior, procede a generar nuevas elecciones
			generateNewChoices();
		}
	};

	// Función para generar nuevas elecciones y agregarlas a la secuencia existente
	const generateNewChoices = () => {
		let lastColorIndex = pcChoice[pcChoice.length - 1]; // Último color de la secuencia existente
		for (let i = 0; i < 1; i++) {
			setTimeout(
				() => {
					let value;
					do {
						value = Math.floor(Math.random() * 4).toString();
						playSound(value);
					} while (value === lastColorIndex); // Evita que se repita el último color de la secuencia anterior
					pcChoice.push(value);
					console.log('Elección de la computadora:', pcChoice);
					const colorIndex = parseInt(pcChoice[pcChoice.length - 1]);
					const colorElement = playerChoiceContainer.children[colorIndex];

					if (colorIndex === lastColorIndex) {
						colorElement.classList.remove('selected');
						setTimeout(() => {
							colorElement.classList.add('selected');
						}, 10);
					} else {
						colorElement.classList.add('selected');
					}

					lastColorIndex = colorIndex;

					setTimeout(() => {
						colorElement.classList.remove('selected');
					}, 500);

					if (pcChoice.length === roundCounter) {
						playerAnswer();
					}
				},
				(i + 1) * 200
			);
		}
	};
	setTimeout(function () {
		playPreviousChoices();
	}, 1000);
	// Inicia la reproducción de la secuencia anterior
};

const playerAnswer = () => {
	playerChoiceContainer.addEventListener('click', playerChoiceElement);
};

const checkResults = () => {
	console.log('Elección del jugador:', playerChoice);
	console.log('Elección de la computadora:', pcChoice);

	if (playerChoice.length === pcChoice.length) {
		if (pcChoice.toString() === playerChoice.toString()) {
			console.log('¡Ganaste!');
			winPoints();
		} else {
			console.log('Perdiste');
			gameActive = false;
			lostGame();
		}
		nextRound();
	}
};

const nextRound = () => {
	roundCounter++;
	playerChoice = [];
	console.log('Nueva ronda. Longitud de la secuencia:', roundCounter);
	pcChoiceElement();
	roundShow();
};
const winPoints = () => {
	points = points + 100;
	pointsCounter.textContent = points;
};
const playSound = value => {
	audio.src = GAME_SOUND[value];
	audio.play();
	console.log(value);
};
const roundShow = () => {
	if (roundCounter < 10) {
		round.textContent = `0${roundCounter}`;
	}
};
const lostGame = () => {};
startButtonElement.addEventListener('click', startGame);
