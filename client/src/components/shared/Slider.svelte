<script lang="ts">
	/* Copyright 2019 Google LLC All Rights Reserved.
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
		http://www.apache.org/licenses/LICENSE-2.0
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
	==============================================================================
	Code modified by Donny Bertucci	
	*/
	export let value: number;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let onChange: (value: number) => void;
	const onSliderChange = (event: any): void => {
		onChange(event.target.value);
	};
</script>

<input type="range" {min} {max} {step} bind:value on:change={onSliderChange} />

<style lang="scss">
	@import "../../styles/theme.scss";
	$dark-clear: #0000001a;
	$knob-color: $primary; //taken from theme

	/* Resets */
	input {
		&[type="range"] {
			-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
			width: 100%; /* Specific width is required for Firefox. */
			background: transparent; /* Otherwise white in Chrome */
			border: none;
			margin: 0;
			&::-webkit-slider-thumb {
				-webkit-appearance: none;
			}
			&:focus {
				outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
			}
			&::-ms-track {
				width: 100%;
				cursor: pointer;
				/* Hides the slider so custom styles can be added */
				background: transparent;
				border-color: transparent;
				color: transparent;
			}
			/* Thumb */
			/* Special styling for WebKit/Blink */
			&::-webkit-slider-thumb {
				-webkit-appearance: none;
				height: 14px;
				width: 14px;
				border-radius: 50%;
				background: $knob-color;
				cursor: pointer;
				margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
			}
			/* All the same stuff for Firefox */
			&::-moz-range-thumb {
				height: 14px;
				width: 14px;
				border-radius: 50%;
				background: $knob-color;
				cursor: pointer;
				border: none;
			}
			/* All the same stuff for IE */
			&::-ms-thumb {
				height: 14px;
				width: 14px;
				border-radius: 50%;
				background: grey;
				cursor: pointer;
			}
			/* Track */
			&::-webkit-slider-runnable-track {
				width: 100%;
				height: 3px;
				cursor: pointer;
				background: $dark-clear;
				border-radius: 2px;
				border: none;
			}
			&:focus::-webkit-slider-runnable-track {
				background: $dark-clear;
			}
			&::-moz-range-track {
				width: 100%;
				height: 3px;
				cursor: pointer;
				background: $dark-clear;
				border-radius: 2px;
				border: none;
			}
			&::-ms-track {
				width: 100%;
				height: 3px;
				cursor: pointer;
				background: $dark-clear;
				border-radius: 2px;
				border: none;
			}
			&::-ms-fill-lower {
				background: $dark-clear;
			}
			&:focus::-ms-fill-lower {
				background: $dark-clear;
			}
			&::-ms-fill-upper {
				background: $dark-clear;
			}
			&:focus::-ms-fill-upper {
				background: $dark-clear;
			}
		}
	}
</style>
