import "./Toolbar.scss";
import { Actions } from "../../App";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/base";

const Toolbar = ({
	currentAction,
	setAction,
}: {
	currentAction: Actions;
	setAction: (action: Actions) => void;
}) => {
	return (
		<div className="toolbar">
			<Dropdown>
				<MenuButton>Tools</MenuButton>

				<Menu className="dropdown">
					<MenuItem
						className={`dropdownItem ${
							currentAction === Actions.RECTANGLE ? "active" : ""
						}`}
						onClick={() => setAction(Actions.RECTANGLE)}
					>
						Rectangle
					</MenuItem>
					<MenuItem
						className={`dropdownItem ${
							currentAction === Actions.CIRCLE ? "active" : ""
						}`}
						onClick={() => setAction(Actions.CIRCLE)}
					>
						Circle
					</MenuItem>
					<MenuItem
						className={`dropdownItem ${
							currentAction === Actions.LINE ? "active" : ""
						}`}
						onClick={() => setAction(Actions.LINE)}
					>
						Line
					</MenuItem>
				</Menu>
			</Dropdown>
			<button
				className={`selectButton ${
					currentAction === Actions.SELECT ? "active" : ""
				}`}
				onClick={() => setAction(Actions.SELECT)}
			>
				Select
			</button>
		</div>
	);
};

export default Toolbar;
