import settings from "../config/Settings.json";

interface Settings {
	readonly layout: 'qwerty' | 'colemak';
	readonly initialHP: number;
}

export { settings as Settings };