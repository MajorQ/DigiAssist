import { browser } from 'webextension-polyfill-ts';
import { Result } from './classes/result';

const result = document.getElementById('result');
const loading = document.getElementById('popup_loading');
const body = document.getElementById('popup_body');

export enum State {
	IDLE = 'IDLE',
	BUSY = 'BUSY',
}

export function toggleLoading(state: State) {
	if (state === State.IDLE) {
		loading.style.display = 'none';
		body.style.display = 'block';
	} else {
		body.style.display = 'none';
		loading.style.display = 'block';
	}
}

export function showError(message: string) {
	const p = document.createElement('p');
	p.innerHTML = message;
	p.style.color = 'red';
	result.appendChild(p);
}

export function createResultBox(res: Result) {
	const box = document.createElement('div');
	box.style.border = 'medium solid #000000';
	box.style.padding = '5px';
	box.style.margin = '5px 0px';
	box.onclick = () => {
		browser.tabs.create({
			url: res.url,
		});
	};

	const student_name = document.createElement('u');
	student_name.innerHTML = res.name;
	student_name.style.fontWeight = 'bold';
	box.appendChild(student_name);

	const prak_name = document.createElement('p');
	prak_name.innerHTML = res.prak_name;
	box.appendChild(prak_name);

	result.appendChild(box);
}
