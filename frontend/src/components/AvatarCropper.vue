<!-- ImagePickCropperV2.vue -->
<template>
  <div class="inline-flex">
    <!-- Start-Button (solange kein Bild gewählt) -->
    <v-btn
      v-if="!hasImage"
      :disabled="disabled"
      :elevation="buttonElevation"
      :prepend-icon="buttonIcon"
      :size="buttonSize"
      :variant="buttonVariant"
      @click="onPickClick"
    >
      {{ buttonLabel }}
    </v-btn>

    <!-- Versteckter File-Input -->
    <input ref="fileInputRef" :accept="accept" class="hidden" type="file" @change="onFileChange" />

    <!-- Cropper-Card -->
    <v-card
      v-if="hasImage"
      class="d-inline-block"
      :elevation="cardElevation"
      :max-width="cardMaxWidthComputed"
    >
      <v-card-title v-if="cardTitle || showFileName" class="text-wrap">
        {{ cardTitle ?? fileName }}
      </v-card-title>

      <div ref="cropperContainerRef" class="pa-2" :style="containerStyle"></div>

      <v-card-actions class="justify-end">
        <v-btn v-if="allowChange" size="small" variant="text" @click="reselect()"
          >Anderes Bild wählen</v-btn
        >
        <v-btn v-if="allowClear" size="small" variant="text" @click="clearSelection()"
          >Entfernen</v-btn
        >
        <v-btn
          color="primary"
          :loading="isExporting"
          size="small"
          variant="flat"
          @click="exportCropped()"
        >
          Übernehmen
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs' // v2.0.1 (Web Components)
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

/** Props */
interface Props {
  // Button
  buttonLabel?: string
  buttonVariant?: 'elevated' | 'flat' | 'tonal' | 'text' | 'outlined' | 'plain'
  buttonSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  buttonElevation?: number
  buttonIcon?: string
  accept?: string
  disabled?: boolean

  // Card
  cardTitle?: string | null
  showFileName?: boolean
  cardElevation?: number
  cardMaxWidth?: number | string | null

  // Arbeitsbereich
  imageWidth?: number | string | undefined
  imageHeight?: number | string | undefined
  aspectRatioCSS?: number | null // nur fürs Layout, nicht Crop!

  // UX
  allowChange?: boolean
  allowClear?: boolean

  // Cropper v2 Optionen (Selection)
  aspectRatio?: number | null
  initialCoverage?: number | null
  selectionOutlined?: boolean
  selectionMovable?: boolean
  selectionResizable?: boolean
  selectionZoomable?: boolean

  // Canvas-Fit
  fitMode?: 'contain' | 'cover' | 'none'

  // Export
  exportMimeType?: 'image/png' | 'image/jpeg' | 'image/webp'
  exportQuality?: number
  exportWidth?: number | null
  exportHeight?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  // Button
  buttonLabel: 'Bild auswählen',
  buttonVariant: 'elevated',
  buttonSize: 'default',
  buttonElevation: 2,
  buttonIcon: 'mdi-crop',
  accept: 'image/*',
  disabled: false,

  // Card
  cardTitle: null,
  showFileName: true,
  cardElevation: 2,
  cardMaxWidth: 520,

  // Arbeitsbereich
  imageWidth: '100%',
  imageHeight: 360,
  aspectRatioCSS: null, // z.B. 1 für 1:1

  // UX
  allowChange: true,
  allowClear: true,

  // Selection Defaults – konservativer
  aspectRatio: null,
  initialCoverage: 0.6, // kleiner -> wirkt „weniger gezoomt“
  selectionOutlined: true,
  selectionMovable: true,
  selectionResizable: true,
  selectionZoomable: false,

  // Fit
  fitMode: 'contain',

  // Export
  exportMimeType: 'image/png',
  exportQuality: 0.92,
  exportWidth: null,
  exportHeight: null,
})

/** Emits */
const emit = defineEmits<{
  (e: 'selected', payload: { file: File; url: string }): void
  (e: 'cleared'): void
  (e: 'error', payload: { message: string }): void
  (e: 'cropped', payload: { blob: Blob; dataUrl: string; width: number; height: number }): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const cropperContainerRef = ref<HTMLDivElement | null>(null)

const fileRef = ref<File | null>(null)
const imageUrl = ref<string | null>(null)
const cropper = ref<Cropper | null>(null)
const isExporting = ref<boolean>(false)

const hasImage = computed<boolean>(() => fileRef.value !== null && imageUrl.value !== null)
const fileName = computed<string | null>(() => fileRef.value?.name ?? null)

const cardMaxWidthComputed = computed<string | number>(() => {
  if (props.cardMaxWidth === null || props.cardMaxWidth === undefined) return 520
  return props.cardMaxWidth
})

const containerStyle = computed<string>(() => {
  const w =
    typeof props.imageWidth === 'number' ? `${props.imageWidth}px` : (props.imageWidth ?? '100%')
  const h =
    typeof props.imageHeight === 'number'
      ? `${props.imageHeight}px`
      : (props.imageHeight ?? '360px')
  const ar =
    typeof props.aspectRatioCSS === 'number' && props.aspectRatioCSS > 0
      ? `aspect-ratio:${props.aspectRatioCSS}/1;`
      : ''
  return `border:1px solid rgba(0,0,0,.08);border-radius:8px;width:${w};max-width:100%;height:${h};${ar}`
})

/** ObjectURL freigeben */
function revokeIfNeeded(): void {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = null
  }
}

/** Cropper aufräumen */
function destroyCropper(): void {
  if (cropper.value) {
    cropper.value = null
  }
  const c = cropperContainerRef.value
  if (c) c.innerHTML = ''
}

/** Button -> versteckten File-Input triggern */
function onPickClick(): void {
  if (props.disabled) return
  fileInputRef.value?.click()
}

/** Dateiwechsel */
function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) {
    clearSelection(false)
    return
  }

  const file = files[0]
  if (!file) {
    emit('error', { message: 'Keine Datei ausgewählt.' })
    return
  }
  if (!file.type.startsWith('image/')) {
    emit('error', { message: 'Nur Bilddateien sind erlaubt.' })
    input.value = ''
    return
  }

  destroyCropper()
  revokeIfNeeded()

  fileRef.value = file
  const url = URL.createObjectURL(file)
  imageUrl.value = url
  emit('selected', { file, url })

  void nextTick().then(() => initCropper(url))
  input.value = ''
}

/** Template für v2 – mit „contain“-Fit statt over-zoom */
function buildTemplate(): string {
  const attrs: string[] = []
  if (props.selectionMovable) attrs.push('movable')
  if (props.selectionResizable) attrs.push('resizable')
  if (props.selectionZoomable) attrs.push('zoomable')
  if (props.selectionOutlined) attrs.push('outlined')
  if (typeof props.initialCoverage === 'number')
    attrs.push(`initial-coverage="${props.initialCoverage}"`)
  if (
    typeof props.aspectRatio === 'number' &&
    Number.isFinite(props.aspectRatio) &&
    props.aspectRatio > 0
  ) {
    attrs.push(`aspect-ratio="${props.aspectRatio}"`)
  }

  // Fit-Modus auf dem Canvas setzen (contain/cover/none)
  const fitAttr = props.fitMode === 'cover' ? 'cover' : props.fitMode === 'none' ? '' : 'contain' // default

  return `
    <cropper-canvas ${fitAttr} background>
      <cropper-image></cropper-image>
      <cropper-handle action="select" plain></cropper-handle>
      <cropper-selection ${attrs.join(' ')}>
        <cropper-grid role="grid" covered></cropper-grid>
        <cropper-crosshair centered></cropper-crosshair>
        <cropper-handle action="move" theme-color="rgba(255,255,255,0.35)"></cropper-handle>
        <cropper-handle action="n-resize"></cropper-handle>
        <cropper-handle action="e-resize"></cropper-handle>
        <cropper-handle action="s-resize"></cropper-handle>
        <cropper-handle action="w-resize"></cropper-handle>
        <cropper-handle action="ne-resize"></cropper-handle>
        <cropper-handle action="nw-resize"></cropper-handle>
        <cropper-handle action="se-resize"></cropper-handle>
        <cropper-handle action="sw-resize"></cropper-handle>
      </cropper-selection>
    </cropper-canvas>
  `
}

/** Cropper v2 initialisieren */
function initCropper(src: string): void {
  const container = cropperContainerRef.value
  if (!container) {
    emit('error', { message: 'Kein Container für den Cropper gefunden.' })
    return
  }

  const image = new Image()
  image.src = src
  image.alt = fileName.value ?? 'Ausgewähltes Bild'

  cropper.value = new Cropper(image, {
    container,
    template: buildTemplate(),
  })
}

/** Auswahl löschen */
function clearSelection(emitEvent = true): void {
  destroyCropper()
  revokeIfNeeded()
  fileRef.value = null
  if (emitEvent) emit('cleared')
}

/** Erneut wählen */
function reselect(): void {
  fileInputRef.value?.click()
}

/** Export */
async function exportCropped(): Promise<void> {
  const c = cropper.value
  if (!c) {
    emit('error', { message: 'Kein aktiver Crop vorhanden.' })
    return
  }
  isExporting.value = true
  try {
    const selection = c.getCropperSelection()
    const canvasEl = selection
      ? await selection.$toCanvas(dimOptions())
      : await c.getCropperCanvas()?.$toCanvas(dimOptions())

    if (!canvasEl) {
      emit('error', { message: 'Konnte Canvas nicht erzeugen.' })
      return
    }

    const blob = await canvasToBlob(canvasEl, props.exportMimeType, props.exportQuality)
    const dataUrl = canvasEl.toDataURL(props.exportMimeType, props.exportQuality)
    emit('cropped', { blob, dataUrl, width: canvasEl.width, height: canvasEl.height })
  } catch {
    emit('error', { message: 'Export fehlgeschlagen.' })
  } finally {
    isExporting.value = false
  }
}

/** Dimensionen fürs $toCanvas */
function dimOptions(): { width?: number; height?: number } {
  const opts: { width?: number; height?: number } = {}
  if (typeof props.exportWidth === 'number') opts.width = props.exportWidth
  if (typeof props.exportHeight === 'number') opts.height = props.exportHeight
  return opts
}

/** Canvas -> Blob */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: 'image/png' | 'image/jpeg' | 'image/webp',
  quality?: number
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob: Blob | null) => {
        if (blob) resolve(blob)
        else reject(new Error('toBlob returned null'))
      },
      type,
      quality
    )
  })
}

/** Cleanup */
onBeforeUnmount(() => {
  destroyCropper()
  revokeIfNeeded()
})
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
