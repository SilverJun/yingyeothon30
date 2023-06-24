import settings from "../config/Settings.json";

interface Settings {
	readonly layout: 'qwerty' | 'colemak';
}

export { settings as Settings };