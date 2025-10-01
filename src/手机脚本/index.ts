import { createApp } from 'vue';
import App from './app.vue';

const SCRIPT_ID = getScriptId();

function mountPoint() {
  if ($(`div[script_id="${SCRIPT_ID}"]`).length === 0) {
    $('<div>').attr('script_id', SCRIPT_ID).appendTo('body');
  }
  return $(`div[script_id="${SCRIPT_ID}"]`);
}

function teleport_style() {
  $('<div>').attr('script_id', SCRIPT_ID).append($('head > style', document).clone()).appendTo('head');
}

function deteleport_style() {
  $(`head > div[script_id="${SCRIPT_ID}"]`).remove();
}

import type { App as VueApp } from 'vue';
let vueApp: VueApp<Element> | null = null;

$(() => {
  const $root = mountPoint();
  vueApp = createApp(App);
  vueApp.mount($root[0]);
  teleport_style();
});

$(window).on('pagehide', () => {
  try {
    vueApp?.unmount?.();
  } catch (e) {
    console.warn(e);
  }
  deteleport_style();
  $(`div[script_id="${SCRIPT_ID}"]`).remove();
});

eventOn(getButtonEvent('卸载手机脚本'), () => {
  try {
    vueApp?.unmount?.();
  } catch (e) {
    console.warn(e);
  }
  deteleport_style();
  $(`div[script_id="${SCRIPT_ID}"]`).remove();
});
