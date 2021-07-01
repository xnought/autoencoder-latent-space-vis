/// <reference types="svelte" />

// Refers to the Mnist json data
declare interface IData {
	data: number[];
	label: number;
}

// the format the 2d coordinate is taken
interface IScatterFormat {
	x: number;
	y: number;
	label: number;
}

declare type color = string;
