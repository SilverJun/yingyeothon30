import settings from "../config/Settings.json";

interface Settings {
	readonly layout: 'qwerty' | 'colemak';
	readonly initialHP: number;
	readonly switchData: {[key:string]: SwitchData};
}

export enum SwitchType {
	blue,
	red,
	brown,
	non_contact,
}

export interface SwitchData {
	// 키 입력이 불가한 피로도 한계치
	readonly fatigueLimitation: number;
	// 1틱당 피로도 감소량
	readonly fatigueDecrement: number;
	// 정확하게 입력했을때 피로도
	readonly fatigueTypeCorrect: number;
	// 키를 틀리게 입력했을때 피로도
	readonly fatigueTypeFailed: number;
	// 피로도 한계가 풀리는 지점
	readonly fatigueRecoverLevel: number;
}

export { settings as Settings };