import { LegacyRef, useRef, useState } from "react";
import "./App.css";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import { Stage as stg } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import Konva from "konva";
import {
	ICircle,
	ILine,
	IRectangle,
	Point,
} from "./interfaces/shapes.interface";
import Toolbar from "./components/toolbar/Toolbar";

export enum Actions {
	SELECT,
	RECTANGLE,
	CIRCLE,
	LINE,
}

function App() {
	const [action, setAction] = useState(Actions.SELECT);
	const [rectangles, setRectangles] = useState<IRectangle[]>([]);
	const [circles, setCircles] = useState<ICircle[]>([]);
	const [lines, setLines] = useState<ILine[]>([]);

	const isPainting = useRef<boolean>(false);
	const currentShapeId = useRef<string>("");
	const stageRef: LegacyRef<stg> = useRef(null);

	const isDraggable = action === Actions.SELECT;

	const formRectanglePoint = useRef<Point>({ x: 0, y: 0 });

	const onRectDragEnd = (
		e: Konva.KonvaEventObject<DragEvent>,
		rectId: string
	) => {
		const draggedRectIndex = rectangles.findIndex(
			(rect) => rect.id === rectId
		);
		const newRect: IRectangle = {
			...rectangles[draggedRectIndex],
			x: e.target.x(),
			y: e.target.y(),
		};

		const newRectangles = [...rectangles];
		newRectangles[draggedRectIndex] = newRect;
		setRectangles(newRectangles);
	};

	const onCircleDragEnd = (
		e: Konva.KonvaEventObject<DragEvent>,
		circleId: string
	) => {
		const draggedCircleIndex = circles.findIndex(
			(circle) => circle.id === circleId
		);
		const newCircle: ICircle = {
			...circles[draggedCircleIndex],
			x: e.target.x(),
			y: e.target.y(),
		};
		console.log(newCircle, "circle");
		const newCircles = [...circles];
		newCircles[draggedCircleIndex] = newCircle;
		setCircles(newCircles);
	};

	const onLineDragEnd = (
		e: Konva.KonvaEventObject<DragEvent>,
		lineId: string
	) => {
		const draggedLineIndex = lines.findIndex((rect) => rect.id === lineId);
		const newLine: ILine = {
			...lines[draggedLineIndex],
			x: e.target.x(),
			y: e.target.y(),
		};
		const newLines = [...lines];
		newLines[draggedLineIndex] = newLine;
		setLines(newLines);
	};

	const onPointerDown = () => {
		if (action === Actions.SELECT) return;

		const stage = stageRef.current;
		const { x, y } = stage?.getRelativePointerPosition() as Vector2d;
		const id = `${Date.now()}-${Math.random()}`;

		currentShapeId.current = id;
		isPainting.current = true;
		formRectanglePoint.current = { x, y };

		switch (action) {
			case Actions.RECTANGLE:
				const newRect: IRectangle = {
					id,
					x: x,
					y: y,
					width: 10,
					height: 10,
				};

				setRectangles((prevRects) => [...prevRects, newRect]);
				break;
			case Actions.CIRCLE:
				const newCircle: ICircle = {
					id,
					x,
					y,
					radius: 0,
				};
				setCircles((prevCircles) => [...prevCircles, newCircle]);
				break;
			case Actions.LINE:
				const newLine: ILine = {
					x: 0,
					y: 0,
					id,
					startX: x,
					startY: y,
					endX: x,
					endY: y,
				};
				setLines((prevLines) => [...prevLines, newLine]);
				break;
		}
	};

	const onPointerMove = () => {
		if (action === Actions.SELECT || !isPainting.current) return;

		const stage = stageRef.current;
		const { x: pointerX, y: pointerY } =
			stage?.getRelativePointerPosition() as Vector2d;

		switch (action) {
			case Actions.RECTANGLE:
				setRectangles((prevRects) =>
					prevRects.map((rect) => {
						if (rect.id === currentShapeId.current) {
							const changedRect: IRectangle = {
								...rect,
								width: pointerX - rect.x,
								height: pointerY - rect.y,
							};

							return changedRect;
						}

						return rect;
					})
				);
				break;
			case Actions.CIRCLE:
				setCircles((prevCircles) =>
					prevCircles.map((circle) => {
						if (circle.id === currentShapeId.current) {
							const { x: formRectangleX, y: formRectangleY } =
								formRectanglePoint.current;
							const radius =
								Math.min(
									Math.abs(pointerX - formRectangleX),
									Math.abs(pointerY - formRectangleY)
								) / 2;
							const changedCircle: ICircle = {
								id: circle.id,
								x:
									formRectangleX +
									Math.sign(pointerX - formRectangleX) *
										radius,
								y:
									formRectangleY +
									Math.sign(pointerY - formRectangleY) *
										radius,
								radius,
							};

							return changedCircle;
						}

						return circle;
					})
				);
				break;
			case Actions.LINE:
				setLines((prevLines) =>
					prevLines.map((line) => {
						if (line.id === currentShapeId.current) {
							const changedLine: ILine = {
								...line,
								endX: pointerX,
								endY: pointerY,
							};

							return changedLine;
						}

						return line;
					})
				);
				break;
		}
	};

	const onPointerUp = () => {
		isPainting.current = false;
	};

	return (
		<div className="app" style={{ position: "relative" }}>
			<Toolbar
				currentAction={action}
				setAction={(action) => setAction(action)}
			/>
			<Stage
				ref={stageRef}
				width={window.innerWidth}
				height={window.innerHeight}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				draggable={isDraggable}
			>
				<Layer>
					{rectangles.map((rectangle) => (
						<Rect
							key={rectangle.id}
							x={rectangle.x}
							y={rectangle.y}
							stroke={"#A9A9A9"}
							strokeWidth={2}
							width={rectangle.width}
							height={rectangle.height}
							draggable={isDraggable}
							onDragEnd={(e) => onRectDragEnd(e, rectangle.id)}
						/>
					))}
					{circles.map((circle) => (
						<Circle
							key={circle.id}
							x={circle.x}
							y={circle.y}
							radius={circle.radius}
							stroke={"#A9A9A9"}
							strokeWidth={2}
							draggable={isDraggable}
							onDragEnd={(e) => onCircleDragEnd(e, circle.id)}
						/>
					))}
					{lines.map((line) => (
						<Line
							x={0}
							y={0}
							key={line.id}
							points={[
								line.startX,
								line.startY,
								line.endX,
								line.endY,
							]}
							stroke={"#A9A9A9"}
							strokeWidth={3}
							draggable={isDraggable}
							onDragEnd={(e) => onLineDragEnd(e, line.id)}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
