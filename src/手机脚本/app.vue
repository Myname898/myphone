<template>
  <div>
    <div class="th-phone-fab" @click="togglePhone" title="打开手机">📱</div>
    <div class="th-phone-wrapper" :style="wrapperStyle">
      <div class="th-phone" :class="{ 'th-phone--open': settings.phoneOpen }" ref="phoneRef">
        <div class="th-notch"></div>
        <div class="th-screen">
          <div class="th-statusbar"><span>9:41</span><span>4G ▰▰▰ 🔋</span></div>
          <div class="th-apps">
            <div class="th-grid" v-if="currentPage === 'home'">
              <div class="th-center">
                <div class="th-app-icon th-app-icon--wechat" @click="openApp('wechat')">微</div>
                <div class="th-app-label">微信</div>
              </div>
            </div>
            <!-- 微信页面 -->
            <div class="th-wechat" v-show="currentPage === 'wechat'">
              <div class="th-wechat-topbar">
                <div class="th-wechat-back" @click="currentPage = 'home'">←</div>
                <div class="th-wechat-title">微信</div>
              </div>
              <div class="th-wechat-list" v-show="wechat.view === 'list'">
                <div class="th-wechat-item" v-for="c in wechat.chats" :key="c.id" @click="openChat(c.id)">
                  <div class="th-wechat-avatar">{{ c.name.slice(0, 1) }}</div>
                  <div class="th-wechat-meta">
                    <div class="th-wechat-name">{{ c.name }}</div>
                    <div class="th-wechat-preview">{{ c.preview }}</div>
                  </div>
                </div>
              </div>
              <div class="th-wechat-chat" v-show="wechat.view === 'chat'">
                <div class="th-wechat-topbar">
                  <div class="th-wechat-back" @click="wechat.view = 'list'">←</div>
                  <div class="th-wechat-title">{{ wechat.current?.name }}</div>
                </div>
                <div class="th-wechat-msgs" ref="msgsRef">
                  <div v-for="(m, i) in wechat.current?.messages" :key="i" class="th-msg" :class="{ me: m.me }">
                    {{ m.text }}
                  </div>
                </div>
                <div class="th-wechat-input">
                  <input v-model="wechat.input" type="text" placeholder="发消息" @keyup.enter="sendMsg" />
                  <div class="th-wechat-send" @click="sendMsg">发送</div>
                </div>
              </div>
            </div>
          </div>
          <div class="th-dock"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { z } from 'zod';

const SettingsSchema = z.object({
  phoneOpen: z.boolean().default(false),
  phoneRight: z.number().min(0).default(24),
  phoneBottom: z.number().min(0).default(78),
});
type Settings = z.infer<typeof SettingsSchema>;

const scriptId = getScriptId();
function loadSettings(): Settings {
  const raw = getVariables({ type: 'script', script_id: scriptId });
  return SettingsSchema.parse(raw ?? {});
}
function saveSettings(next: Partial<Settings>) {
  const current = loadSettings();
  replaceVariables(_.cloneDeep({ ...current, ...next }), { type: 'script', script_id: scriptId });
}

const settings = reactive(loadSettings());
const currentPage = ref<'home' | 'wechat'>('home');
const phoneRef = ref<HTMLElement | null>(null);
const msgsRef = ref<HTMLElement | null>(null);

const wrapperStyle = computed(() => ({
  display: settings.phoneOpen ? 'block' : 'none',
  right: settings.phoneRight + 'px',
  bottom: settings.phoneBottom + 'px',
}));

function togglePhone() {
  settings.phoneOpen = !settings.phoneOpen;
}

function openApp(app: 'wechat') {
  if (app === 'wechat') {
    currentPage.value = 'wechat';
    wechat.view = 'list';
  }
}

type Chat = { id: string; name: string; preview: string; messages: { text: string; me?: boolean }[] };
const wechat = reactive({
  view: 'list' as 'list' | 'chat',
  chats: [
    { id: 'a', name: '小明', preview: '在吗？', messages: [{ text: '在吗？' }] },
    { id: 'b', name: '群聊', preview: '今晚 8 点开黑', messages: [{ text: '今晚 8 点开黑' }] },
  ] as Chat[],
  current: null as Chat | null,
  input: '',
});

function openChat(id: string) {
  const c = wechat.chats.find(x => x.id === id) || null;
  wechat.current = c;
  wechat.view = 'chat';
  nextTick(() => scrollToBottom());
}
function sendMsg() {
  const text = wechat.input.trim();
  if (!text || !wechat.current) return;
  wechat.current.messages.push({ text, me: true });
  wechat.current.preview = text;
  wechat.input = '';
  nextTick(() => scrollToBottom());
}
function scrollToBottom() {
  if (!msgsRef.value) return;
  msgsRef.value.scrollTop = msgsRef.value.scrollHeight;
}

// 拖拽
let dragStartX = 0,
  dragStartY = 0;
let wrapStartRight = 24,
  wrapStartBottom = 78;
let dragging = false;
onMounted(() => {
  const $wrap = $(phoneRef.value!).closest('.th-phone-wrapper');
  $(phoneRef.value!).on('mousedown touchstart', e => {
    if ($(e.target as Element).closest('.th-screen').length) return;
    const isTouch = (e as any).originalEvent?.touches?.length > 0;
    dragStartX = isTouch ? (e as any).originalEvent.touches[0].clientX : (e as MouseEvent).clientX;
    dragStartY = isTouch ? (e as any).originalEvent.touches[0].clientY : (e as MouseEvent).clientY;
    const currentRight = parseFloat(($wrap.css('right') || '24').toString());
    const currentBottom = parseFloat(($wrap.css('bottom') || '78').toString());
    wrapStartRight = isNaN(currentRight) ? 24 : currentRight;
    wrapStartBottom = isNaN(currentBottom) ? 78 : currentBottom;
    dragging = true;
    $(document).on('mousemove.th-phone touchmove.th-phone', onMove as any);
    $(document).on('mouseup.th-phone touchend.th-phone', endDrag as any);
  });
  function onMove(e: JQuery.TriggeredEvent | MouseEvent | TouchEvent) {
    if (!dragging) return;
    const isTouch = (e as TouchEvent).touches && (e as TouchEvent).touches.length > 0;
    const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;
    const right = Math.max(0, wrapStartRight - dx);
    const bottom = Math.max(0, wrapStartBottom - dy);
    $wrap.css({ right: right + 'px', bottom: bottom + 'px' });
    settings.phoneRight = right;
    settings.phoneBottom = bottom;
  }
  function endDrag() {
    dragging = false;
    $(document).off('mousemove.th-phone touchmove.th-phone', onMove as any);
    $(document).off('mouseup.th-phone touchend.th-phone', endDrag as any);
  }
});

// 同步设置到酒馆变量
watch(
  settings,
  now => {
    saveSettings(now);
  },
  { deep: true },
);
</script>

<style scoped>
.th-phone-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 99999;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: #111;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  font-size: 20px;
}
.th-phone-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
}
.th-phone-wrapper {
  position: fixed;
  right: 24px;
  bottom: 78px;
  z-index: 99998;
  width: 360px;
  height: 760px;
  pointer-events: none;
}
.th-phone {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  border-radius: 42px;
  background: #0a0a0a;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 0 0 0 10px #1a1a1a;
  overflow: hidden;
  transform: translateY(20px) scale(0.98);
  opacity: 0;
  transition:
    transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    opacity 0.28s;
  pointer-events: auto;
}
.th-phone--open {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.th-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 34px;
  background: #000;
  border-radius: 18px;
  box-shadow: 0 0 0 2px #121212;
}
.th-screen {
  position: absolute;
  inset: 8px;
  border-radius: 34px;
  background: linear-gradient(180deg, #111, #0b0b0b);
  overflow: hidden;
}
.th-statusbar {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  color: #cfcfcf;
  font-size: 12px;
}
.th-apps {
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 48px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.th-dock {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  height: 70px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  backdrop-filter: blur(10px);
}
.th-app-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 10px 20px rgba(0, 0, 0, 0.35);
}
.th-app-icon--wechat {
  background: #07c160;
}
.th-app-label {
  text-align: center;
  color: #d0d0d0;
  font-size: 12px;
  margin-top: 6px;
}
.th-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.th-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* 微信 */
.th-wechat {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #111;
}
.th-wechat-topbar {
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}
.th-wechat-back {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.th-wechat-title {
  font-weight: 600;
}
.th-wechat-list {
  flex: 1;
  overflow: auto;
  background: #fff;
}
.th-wechat-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}
.th-wechat-avatar {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: #07c160;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.th-wechat-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.th-wechat-name {
  font-weight: 600;
}
.th-wechat-preview {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
}
.th-wechat-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #eaeaea;
}
.th-wechat-msgs {
  flex: 1;
  padding: 12px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.th-msg {
  max-width: 70%;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fff;
  align-self: flex-start;
}
.th-msg.me {
  background: #a7e2b3;
  align-self: flex-end;
}
.th-wechat-input {
  height: 54px;
  background: #f6f6f6;
  border-top: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
}
.th-wechat-input input {
  flex: 1;
  height: 36px;
  border-radius: 18px;
  border: 1px solid #ddd;
  padding: 0 12px;
  outline: none;
}
.th-wechat-send {
  height: 36px;
  padding: 0 12px;
  border-radius: 18px;
  background: #07c160;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
