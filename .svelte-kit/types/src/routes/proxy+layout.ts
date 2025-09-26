// @ts-nocheck
import { browser } from "$app/environment";
import "$lib/i18n";
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load = async ({ data }: Parameters<LayoutLoad>[0]) => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();

	return data;
};
