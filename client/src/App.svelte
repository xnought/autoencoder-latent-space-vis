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
	<a
		href="https://colab.research.google.com/drive/1jy6zd6mxneepQZe_UiHsz6CMn6mj3A-e?usp=sharing"
		target="_blank"
		id="colab"
		><img
			src="https://colab.research.google.com/assets/colab-badge.svg"
			alt="Open In Colab"
		/></a
	>
</main>

<style lang="scss">
	@import "./styles/theme.scss";

	// h1 {
	// 	&::selection {
	// 		background: $primary;
	// 		color: white;
	// 	}
	// }
	#colab {
		position: fixed;
		bottom: 25px;
		right: 25px;
	}
</style>
