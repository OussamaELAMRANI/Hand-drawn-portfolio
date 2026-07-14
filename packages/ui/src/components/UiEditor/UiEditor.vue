<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { Placeholder } from '@tiptap/extensions'
import { BadgeNode, ChipNode, PillNode, PinNode, SketchBoxNode, TapeNode } from './nodes'
import type { JSONContent, UiEditorProps } from './UiEditor.types'

const props = withDefaults(defineProps<UiEditorProps>(), {
  modelValue: null,
  placeholder: 'Write something…',
  editable: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: JSONContent] }>()

const editor = shallowRef<Editor>()
// bumped on every transaction so the toolbar's isActive states stay reactive
const tick = ref(0)
const linkOpen = ref(false)
const linkUrl = ref('')
// last-known selection range, refreshed on every transaction — reading this
// instead of the live editor selection means the variant <select>s below
// (which steal DOM focus from the editor when opened) still insert into the
// text the user actually had selected
const lastSelection = ref({ from: 0, to: 0 })

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue ?? undefined,
    editable: props.editable,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Highlight,
      ChipNode,
      BadgeNode,
      PillNode,
      TapeNode,
      PinNode,
      SketchBoxNode,
      Placeholder.configure({ placeholder: () => props.placeholder }),
    ],
    onUpdate: ({ editor: e }) => emit('update:modelValue', e.getJSON()),
    onTransaction: ({ editor: e }) => {
      tick.value++
      lastSelection.value = { from: e.state.selection.from, to: e.state.selection.to }
    },
  })
})
onBeforeUnmount(() => editor.value?.destroy())

watch(
  () => props.modelValue,
  (value) => {
    const e = editor.value
    if (!e || JSON.stringify(value) === JSON.stringify(e.getJSON())) return
    e.commands.setContent(value ?? '', { emitUpdate: false })
  },
)
watch(
  () => props.editable,
  (value) => editor.value?.setEditable(value),
)

const chain = () => editor.value!.chain().focus()

// text selected when a variant dropdown was opened, so inserting a component
// wraps it instead of replacing it with a hardcoded placeholder
function selectedText(fallback: string): string {
  const e = editor.value
  if (!e) return fallback
  const { from, to } = lastSelection.value
  return e.state.doc.textBetween(from, to, ' ') || fallback
}

interface ToolButton {
  label: string
  title: string
  active?: string | { name: string; attrs?: Record<string, unknown> }
  run: () => void
}

const buttons: ToolButton[] = [
  { label: 'B', title: 'Bold', active: 'bold', run: () => chain().toggleBold().run() },
  { label: 'I', title: 'Italic', active: 'italic', run: () => chain().toggleItalic().run() },
  { label: 'S', title: 'Strikethrough', active: 'strike', run: () => chain().toggleStrike().run() },
  { label: '</>', title: 'Inline code', active: 'code', run: () => chain().toggleCode().run() },
  { label: '✏', title: 'Highlight', active: 'highlight', run: () => chain().toggleHighlight().run() },
  {
    label: 'H2',
    title: 'Heading',
    active: { name: 'heading', attrs: { level: 2 } },
    run: () => chain().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'H3',
    title: 'Subheading',
    active: { name: 'heading', attrs: { level: 3 } },
    run: () => chain().toggleHeading({ level: 3 }).run(),
  },
  { label: '• list', title: 'Bullet list', active: 'bulletList', run: () => chain().toggleBulletList().run() },
  { label: '1. list', title: 'Numbered list', active: 'orderedList', run: () => chain().toggleOrderedList().run() },
  { label: '❝', title: 'Quote', active: 'blockquote', run: () => chain().toggleBlockquote().run() },
  { label: '{ }', title: 'Code block', active: 'codeBlock', run: () => chain().toggleCodeBlock().run() },
  { label: 'tape', title: 'Insert tape', run: () => chain().insertContent({ type: 'tape' }).run() },
  { label: 'pin', title: 'Insert pin', run: () => chain().insertContent({ type: 'pin' }).run() },
]

interface VariantOption {
  label: string
  attrs: Record<string, unknown>
}

interface VariantDropdown {
  /** node type name — 'sketchBox' wraps the selection instead of inserting */
  type: string
  title: string
  options: VariantOption[]
}

const dropdowns: VariantDropdown[] = [
  {
    type: 'chip',
    title: 'Insert chip',
    options: [
      { label: 'auto color', attrs: { variant: 'sketch', stroke: null } },
      { label: 'subtle', attrs: { variant: 'subtle' } },
      { label: 'gray', attrs: { variant: 'sketch', stroke: 'gray' } },
      { label: 'ink', attrs: { variant: 'sketch', stroke: 'ink' } },
      { label: 'cyan', attrs: { variant: 'sketch', stroke: 'cyan' } },
      { label: 'magenta', attrs: { variant: 'sketch', stroke: 'magenta' } },
      { label: 'violet', attrs: { variant: 'sketch', stroke: 'violet' } },
      { label: 'amber', attrs: { variant: 'sketch', stroke: 'amber' } },
    ],
  },
  {
    type: 'badge',
    title: 'Insert badge',
    options: [
      { label: 'ai', attrs: { variant: 'ai' } },
      { label: 'code', attrs: { variant: 'code' } },
      { label: 'news', attrs: { variant: 'news' } },
      { label: 'career', attrs: { variant: 'career' } },
    ],
  },
  {
    type: 'pill',
    title: 'Insert pill',
    options: [
      { label: 'inactive', attrs: { active: false } },
      { label: 'active', attrs: { active: true } },
    ],
  },
  {
    type: 'sketchBox',
    title: 'Sketch box',
    options: [
      { label: 'rect', attrs: { shape: 'rect' } },
      { label: 'pill', attrs: { shape: 'pill' } },
      { label: 'ellipse', attrs: { shape: 'ellipse' } },
    ],
  },
]

function onDropdownChange(dropdown: VariantDropdown, event: Event) {
  const select = event.target as HTMLSelectElement
  const index = Number(select.value)
  select.value = ''
  const option = dropdown.options[index]
  if (!option) return

  if (dropdown.type === 'sketchBox') {
    chain().toggleSketchBox(option.attrs).run()
    return
  }

  chain()
    .insertContentAt(lastSelection.value, {
      type: dropdown.type,
      attrs: option.attrs,
      content: [{ type: 'text', text: selectedText(dropdown.type) }],
    })
    .run()
}

function isActive(button: ToolButton): boolean {
  void tick.value
  const e = editor.value
  if (!e || !button.active) return false
  return typeof button.active === 'string'
    ? e.isActive(button.active)
    : e.isActive(button.active.name, button.active.attrs)
}

function toggleLinkInput() {
  const e = editor.value
  if (!e) return
  linkUrl.value = (e.getAttributes('link').href as string | undefined) ?? ''
  linkOpen.value = !linkOpen.value
}

function applyLink() {
  const url = linkUrl.value.trim()
  if (url) chain().extendMarkRange('link').setLink({ href: url }).run()
  else chain().extendMarkRange('link').unsetLink().run()
  linkOpen.value = false
}
</script>

<template>
  <div
    class="ui-editor"
    :class="
      editable
        ? `rounded-lg border-[1.5px] border-[#dcdcd2] bg-white transition-colors duration-150
           ease-out focus-within:border-cyan dark:border-night-500 dark:bg-night-800`
        : ''
    "
  >
    <div
      v-if="editable && editor"
      class="flex flex-wrap items-center gap-1 border-b border-dashed border-ink-100 px-2 py-1.5
             dark:border-night-500"
    >
      <button
        v-for="button in buttons"
        :key="button.title"
        type="button"
        :title="button.title"
        class="cursor-pointer rounded-md px-2 py-0.5 font-hand text-[15px] transition-colors duration-100"
        :class="
          isActive(button)
            ? 'bg-marker text-ink'
            : 'text-ink-500 hover:bg-paper-200 dark:text-chalk-500 dark:hover:bg-night-600'
        "
        @mousedown.prevent
        @click="button.run()"
      >
        {{ button.label }}
      </button>
      <button
        type="button"
        title="Link"
        class="cursor-pointer rounded-md px-2 py-0.5 font-hand text-[15px] transition-colors duration-100"
        :class="
          (void tick, editor?.isActive('link'))
            ? 'bg-marker text-ink'
            : 'text-ink-500 hover:bg-paper-200 dark:text-chalk-500 dark:hover:bg-night-600'
        "
        @mousedown.prevent
        @click="toggleLinkInput"
      >
        link
      </button>
      <select
        v-for="dropdown in dropdowns"
        :key="dropdown.type"
        :title="dropdown.title"
        class="cursor-pointer rounded-md border-none bg-transparent px-1.5 py-0.5 font-hand
               text-[15px] text-ink-500 hover:bg-paper-200 dark:text-chalk-500
               dark:hover:bg-night-600"
        @change="onDropdownChange(dropdown, $event)"
      >
        <option value="" disabled selected>{{ dropdown.type }} ▾</option>
        <option v-for="(option, i) in dropdown.options" :key="i" :value="i">
          {{ option.label }}
        </option>
      </select>
    </div>

    <div
      v-if="editable && linkOpen"
      class="flex items-center gap-2 border-b border-dashed border-ink-100 px-3 py-2 dark:border-night-500"
    >
      <input
        v-model="linkUrl"
        type="url"
        placeholder="https://…"
        class="w-full rounded-md border border-ink-100 bg-paper-200 px-2 py-1 font-mono text-xs
               text-ink outline-none focus:border-cyan dark:border-night-500 dark:bg-night-700 dark:text-chalk"
        @keydown.enter.prevent="applyLink"
        @keydown.escape="linkOpen = false"
      />
      <button
        type="button"
        class="cursor-pointer font-hand text-[15px] text-cyan"
        @click="applyLink"
      >
        set
      </button>
    </div>

    <EditorContent :editor="editor" :class="editable ? 'px-3 py-2' : ''" />
  </div>
</template>

<style>
/* TipTap owns this DOM, so classes can't be applied per-node — plain CSS
   namespaced under .ui-editor instead. Palette hexes match the tailwind preset. */
.ui-editor .tiptap {
    outline: none;
    font-size: 16px;
    line-height: 1.6;
}
.ui-editor[class*='border'] .tiptap {
    min-height: 180px;
}
.ui-editor .tiptap > * + * {
    margin-top: 0.6em;
}
.ui-editor .tiptap h1,
.ui-editor .tiptap h2,
.ui-editor .tiptap h3 {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    line-height: 1.05;
}
.ui-editor .tiptap h1 { font-size: 2.4em; }
.ui-editor .tiptap h2 { font-size: 2em; }
.ui-editor .tiptap h3 { font-size: 1.55em; }
.ui-editor .tiptap ul,
.ui-editor .tiptap ol {
    padding-left: 1.4em;
}
.ui-editor .tiptap ul { list-style: disc; }
.ui-editor .tiptap ol { list-style: decimal; }
.ui-editor .tiptap blockquote {
    border-left: 2.5px dashed #cfcfc7;
    padding-left: 14px;
    color: #6a6a60;
    font-family: 'Patrick Hand', cursive;
    font-size: 1.05em;
}
.ui-editor .tiptap code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85em;
    background: #f2f2ea;
    border-radius: 4px;
    padding: 1px 5px;
}
.ui-editor .tiptap pre {
    background: #22252b;
    color: #e9e9e1;
    border-radius: 8px;
    padding: 12px 16px;
    overflow-x: auto;
}
.ui-editor .tiptap pre code {
    background: transparent;
    padding: 0;
    font-size: 0.82em;
}
/* matches UiHighlight's marker look — stays bright yellow / dark ink in both themes */
.ui-editor .tiptap mark {
    display: inline-block;
    transform: rotate(-1deg);
    background: #FCE34B;
    color: #2A2A2A;
    padding: 1px 8px;
}
.ui-editor .tiptap a {
    color: #0e93a8;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-underline-offset: 3px;
}
.ui-editor .tiptap hr {
    border: none;
    border-top: 2px dashed #cfcfc7;
    margin: 1.2em 0;
}
.ui-editor .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
    color: #a5a59a;
}
.dark .ui-editor .tiptap blockquote {
    border-left-color: #3a3d45;
    color: #a2a29a;
}
.dark .ui-editor .tiptap code {
    background: #2c2f37;
}
.dark .ui-editor .tiptap p.is-editor-empty:first-child::before {
    color: #7e7e76;
}
.dark .ui-editor .tiptap hr {
    border-top-color: #3a3d45;
}
</style>
