<script lang="ts">
	import Scatter from "./components/scatter/Scatter.svelte";
	import MnistDigit from "./components/mnistDigit/MnistDigit.svelte";
	import { onDestroy, onMount } from "svelte";
	import { dataFilePath, get } from "./app";
	import * as tf from "@tensorflow/tfjs";

	export let title: string;
	let g;

	let digit: number[];
	let loaded = false;
	const logMemory = (): void => {
		console.table(tf.memory());
	};

	// first convert digit data to tensors
	// create a function that assigns coordinates and colors
	const to2D = (tensor2D) => tensor2D.arraySync();

	const encode = (encoder: tf.LayersModel, inputTensor: tf.Tensor) => {
		const encoded = encoder.predict(inputTensor);
		return { tensor: encoded, regular: to2D(encoded) };
	};
	const decode = (decoder: tf.LayersModel, encodedTensor: tf.Tensor) => {
		const decoded = decoder.predict(encodedTensor);
		return to2D(decoded);
	};

	const decodeGivenCoord = (
		decoder: tf.LayersModel,
		coord: [number, number]
	) => {
		const input = tf.tensor([coord]);
		const decoded = decode(decoder, input);
		return decoded[0];
	};

	const unWrapData = (digits: IData[]) => {
		let data = [],
			labels = [];
		for (let i = 0; i < digits.length; i++) {
			const curr = digits[i];
			data.push(curr.data);
			labels.push(curr.label);
		}
		return { data2D: data, label2D: labels };
	};
	interface IScatterFormat {
		x: number;
		y: number;
		label: number;
	}
	const reformatForScatter = (
		labels: number[],
		coords2D: [number, number][]
	): IScatterFormat[] => {
		let formatted: IScatterFormat[] = [];
		for (let i = 0; i < labels.length; i++) {
			const [x, y] = coords2D[i],
				label = labels[i]; // extract needed
			const combine: IScatterFormat = { x, y, label }; // combine to correct format
			formatted.push(combine);
		}
		return formatted;
	};
	let x = 0,
		y = 40;
	let encoder: tf.LayersModel, decoder: tf.LayersModel;
	let d: number[];
	let formattedData: IScatterFormat[];

	onMount(async () => {
		const data = await get<IData>(dataFilePath("test-MNIST.json"));
		digit = data[0].data;

		g = data;
		const { data2D, label2D } = unWrapData(g);
		// console.log(data2D, label2D);
		const data2DTensor = tf.tensor(data2D);
		encoder = await tf.loadLayersModel("datafiles/encoder/model.json");
		decoder = await tf.loadLayersModel("datafiles/decoder/model.json");

		d = decodeGivenCoord(decoder, [x, y]);
		const { regular } = encode(encoder, data2DTensor);
		// console.log(regular);
		formattedData = reformatForScatter(label2D, regular);

		loaded = true;

		// clear memory
		// encoded.dispose();
		// decoded.dispose();
		// decoder.dispose();
		// encoder.dispose();
		// tensorDigit.dispose();
	});
	// afterUpdate(() => {
	// 	logMemory();
	// });
	onDestroy(() => {
		encoder.dispose();
		decoder.dispose();
	});
	let square = 600;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<main>
	<div id="bar">
		<div id="title">Autoencoder latent space visualizer</div>
		<div id="button-container">
			<div>
				<a
					href="https://github.com/xnought/autoencoder-latent-space-vis"
					target="_blank"
					id="github"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						><path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						/></svg
					></a
				>
			</div>
			<div class="divider" />
			<div>
				<a
					href="https://colab.research.google.com/drive/1jy6zd6mxneepQZe_UiHsz6CMn6mj3A-e?usp=sharing"
					target="_blank"
					id="colab"
					><img
						src="https://colab.research.google.com/assets/colab-badge.svg"
						alt="Open In Colab"
					/></a
				>
			</div>
			<div class="divider" />
			<a id="personal" href="https://donnybertucci.com"
				>Made by Donny Bertucci</a
			>
		</div>
	</div>
	{#if loaded}
		<div style="display: flex; justify-content: center;">
			<div style="display: flex;">
				<div>
					<Scatter
						width={square * 1.2}
						height={square}
						data={formattedData}
						xDomain={[-80, 10]}
						yDomain={[-40, 70]}
						radius={2}
						strokeWidth={0.5}
						position={(xPoint, yPoint) => {
							(x = xPoint), (y = yPoint);
							tf.tidy(() => {
								d = decodeGivenCoord(decoder, [+x, +y]);
								return undefined;
							});
						}}
					/>
				</div>
				<div style="margin-left: 100px;">
					<MnistDigit data={d} {square} />
					<p>
						latent space coordinate: ({x.toFixed(3)}, {y.toFixed(
							3
						)})
					</p>
				</div>
			</div>
		</div>
	{:else}
		<h1>Loading MNIST Digits test and Models...</h1>
	{/if}
</main>

<style lang="scss">
	@import "./styles/theme.scss";

	// h1 {
	// 	&::selection {
	// 		background: $primary;
	// 		color: white;
	// 	}
	// }
	#bar {
		background-color: $primary;
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		height: 50px;
		#title {
			margin-left: 20px;
			font-size: 20px;
			color: white;
		}
	}
	#button-container {
		position: fixed;
		right: 20px;
		bottom: 20px;

		display: flex;
		align-items: center;

		.divider {
			background: black;
			height: 40px;
			width: 1px;
			margin-right: 10px;
			margin-left: 10px;
		}
		#personal {
			color: $primary;
		}
	}
</style>
