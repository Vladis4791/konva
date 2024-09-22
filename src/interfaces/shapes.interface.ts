export interface Point {
	x: number;
	y: number;
}

export interface Shape {
	id: string;
	color?: string;
}

export interface IRectangle extends Shape, Point {
	width: number;
	height: number;
}

export interface ICircle extends Shape, Point {
	radius: number;
}

export interface ILine extends Shape, Point {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
}