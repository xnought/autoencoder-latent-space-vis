<script lang="ts">
	export let width: number = 0;
	export let height: number = 0;
	export let fill: string = "none";
	export let stroke: string = "grey";
	export let strokeWidth: number = 1;

	// check if the width and height exists and combinations
	const propExists = (prop: number): boolean => prop > 0;
	const widthExists = propExists(width),
		heightExists = propExists(height);
	const onlyWidthExists = widthExists && !heightExists,
		onlyHeightExists = !widthExists && heightExists;

	// make the outline length a square if one does length DNE
	if (onlyWidthExists) {
		height = width;
	} else if (onlyHeightExists) {
		width = height;
	}
</script>

<rect {width} {height} {fill} {stroke} stroke-width={strokeWidth} />
