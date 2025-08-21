<template>
  <div class="avatar-cropper">
    <!-- Default trigger: Avatar mit Klick zum Öffnen -->
    <v-tooltip location="bottom" text="Avatar ändern">
      <template #activator="{ props: activatorProps }">
        <v-avatar
          v-bind="activatorProps"
          class="cursor-pointer"
          :rounded="circlePreview"
          :size="avatarSize"
          @click="triggerFileInput()"
        >
          <v-img v-if="modelValue" cover :src="modelValue" />
          <v-icon v-else size="36">mdi-account-circle</v-icon>
        </v-avatar>
      </template>
    </v-tooltip>

    <v-file-input
      ref="fileInputRef"
      v-model="files"
      accept="image/*"
      density="comfortable"
      hide-details
      label="Bild auswählen"
      prepend-icon="mdi-image"
      style="display: none"
      variant="outlined"
      @change="onFileSelected"
    ></v-file-input>

    <!-- Arbeitsfenster: Modaler Dialog -->
    <v-dialog v-model="dialog" :max-width="dialogMaxWidth">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ dialogTitle }}</span>
          <v-btn icon="mdi-close" variant="text" @click="close()"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-alert
            v-if="errorMessage"
            class="mb-3"
            density="compact"
            :text="errorMessage"
            type="error"
            @click="errorMessage = ''"
          ></v-alert>

          <v-row align="start" class="ga-4" justify="space-between" no-gutters>
            <v-col :cols="12" :md="7">
              <div
                ref="cropWrapRef"
                class="crop-wrap"
                :style="cropWrapStyle"
                @dragenter.prevent
                @dragover.prevent
                @drop.prevent="onDrop"
              >
                <div v-if="!imageReady" class="placeholder">Bild wählen oder hier ablegen</div>
                <img
                  ref="imgRef"
                  :alt="altText"
                  class="source-img"
                  :src="imageSrc || transparentPixel"
                  :style="{ display: imageReady ? 'block' : 'none' }"
                />
              </div>
            </v-col>

            <v-col class="d-flex flex-column ga-4" :cols="12" :md="5">
              <div class="d-flex ga-3 align-center">
                <!-- The v-file-input was here, now it's outside and hidden -->
                <v-btn
                  :disabled="!cropper"
                  icon="mdi-rotate-left"
                  variant="tonal"
                  @click="rotate(-90)"
                ></v-btn>
                <v-btn
                  :disabled="!cropper"
                  icon="mdi-rotate-right"
                  variant="tonal"
                  @click="rotate(90)"
                ></v-btn>
                <v-btn
                  :disabled="!cropper"
                  icon="mdi-aspect-ratio"
                  :title="
                    aspectLocked ? 'Seitenverhältnis entsperren' : 'Seitenverhältnis 1:1 sperren'
                  "
                  variant="tonal"
                  @click="toggleAspect()"
                ></v-btn>
                <v-btn
                  :disabled="!cropper"
                  icon="mdi-restore"
                  variant="tonal"
                  @click="reset()"
                ></v-btn>
              </div>

              <div class="d-flex align-center ga-3">
                <span class="text-caption">Zoom</span>
                <v-slider
                  v-model="zoom"
                  class="flex-1-1"
                  :disabled="!cropper"
                  hide-details
                  :max="zoomMax"
                  :min="zoomMin"
                  :step="0.01"
                  @update:model-value="onZoomChange"
                ></v-slider>
              </div>

              <div class="d-flex ga-4 align-start">
                <div
                  ref="previewRef"
                  aria-label="Runde Vorschau"
                  class="preview"
                  :style="previewStyle"
                ></div>
                <div class="text-body-2">
                  <div class="mb-2">Ausgabeformat:</div>
                  <v-btn-toggle v-model="format" density="comfortable" mandatory>
                    <v-btn value="image/png">PNG</v-btn>
                    <v-btn value="image/jpeg">JPEG</v-btn>
                    <v-btn value="image/webp">WEBP</v-btn>
                  </v-btn-toggle>
                  <div class="mt-4">Qualität (JPEG/WEBP)</div>
                  <v-slider
                    v-model="quality"
                    class="w-64"
                    density="compact"
                    hide-details
                    :max="1"
                    :min="0.5"
                    :step="0.01"
                  ></v-slider>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="close()">Abbrechen</v-btn>
          <v-btn color="primary" :disabled="!cropper" @click="save()">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import Cropper, { type CropperOptions } from 'cropperjs'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp'

interface CroppedPayload {
  blob: Blob
  dataUrl: string
}

const props = defineProps<{
  modelValue?: string | null
  avatarSize?: number
  dialogMaxWidth?: number | string
  dialogTitle?: string
  outputSize?: number
  aspectRatio?: number // 0 = frei, 1 = 1:1 default
  allowFreeAspect?: boolean
  circlePreview?: boolean
  defaultFormat?: OutputFormat
  defaultQuality?: number
  allowedMimeTypes?: readonly string[]
  maxFileSize?: number
  containerSize?: number
  previewSize?: number
  cropperOptions?: Partial<CropperOptions>
  altText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue' | 'error', value: string): void
  (e: 'cropped', payload: CroppedPayload): void
  (e: 'open-change', open: boolean): void
}>()

const dialogTitle = computed(() => props.dialogTitle ?? 'Avatar zuschneiden')
const avatarSize = computed(() => props.avatarSize ?? 64)
const dialogMaxWidth = computed(() => props.dialogMaxWidth ?? 960)
const outputSize = computed(() => props.outputSize ?? 256)
const containerSize = computed(() => props.containerSize ?? 360)
const previewSize = computed(() => props.previewSize ?? 140)
const circlePreview = computed(() => props.circlePreview ?? true)
const altText = computed(() => props.altText ?? 'Zu schneidendes Bild')
const allowFreeAspect = computed(() => props.allowFreeAspect ?? true)

const aspectRatio = ref<number>(props.aspectRatio ?? 1)
const aspectLocked = computed(() => aspectRatio.value > 0)

const format = ref<OutputFormat>(props.defaultFormat ?? 'image/png')
const quality = ref<number>(props.defaultQuality ?? 0.92)

const allowed = computed<readonly string[]>(
  () => props.allowedMimeTypes ?? ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
const maxFileSize = computed<number>(() => props.maxFileSize ?? 10 * 1024 * 1024)

const dialog = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)
const cropWrapRef = ref<HTMLDivElement | null>(null)
const previewRef = ref<HTMLDivElement | null>(null)
const files = ref<File[] | null>(null)
const imageSrc = ref<string>('')
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
const cropper = ref<Cropper | null>(null)
const errorMessage = ref('')
const imageReady = ref(false)

const fileInputRef = ref<any>(null)

const zoom = ref(1)
const zoomMin = 0.1
const zoomMax = 5

const cropWrapStyle = computed(() => ({
  width: `${containerSize.value}px`,
  height: `${containerSize.value}px`,
}))

const previewStyle = computed(() => ({
  width: `${previewSize.value}px`,
  height: `${previewSize.value}px`,
  borderRadius: circlePreview.value ? '50%' : '8px',
}))

function open(): void {
  dialog.value = true
}
function close(): void {
  dialog.value = false
}

function triggerFileInput(): void {
  console.log('triggerFileInput called')
  console.log('fileInputRef.value:', fileInputRef.value)
  if (fileInputRef.value) {
    nextTick(() => {
      const nativeInput = (fileInputRef.value as any).$el.querySelector('input[type="file"]')
      console.log('nativeInput (inside nextTick):', nativeInput)
      nativeInput?.click()
      console.log('Attempted to click file input.')
    })
  }
}

function setError(msg: string): void {
  errorMessage.value = msg
  emit('error', msg)
}

function validateFile(file: File): string | null {
  if (!allowed.value.includes(file.type)) return `Unzulässiger Dateityp: ${file.type}`
  if (file.size > maxFileSize.value)
    return `Datei zu groß (>${Math.round(maxFileSize.value / (1024 * 1024))}MB)`
  return null
}

let objectUrl: string | null = null
function revokeObjectUrl(): void {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }
}

function destroyCropper(): void {
  if (cropper.value) {
    cropper.value = null
  }
  imageReady.value = false
}

function mountCropper(): void {
  const img = imgRef.value
  const preview = previewRef.value
  if (!img || !preview) return
  requestAnimationFrame(() => {
    destroyCropper()
    const opts: CropperOptions = {
      ...props.cropperOptions,
    }
    cropper.value = new Cropper(img, opts)
    const selection = cropper.value.getCropperSelection()
    if (selection) {
      selection.aspectRatio = aspectRatio.value > 0 ? aspectRatio.value : Number.NaN
    }
    imageReady.value = true
  })
}

function onFileSelected(event: Event): void {
  console.log('onFileSelected called')
  const file = (event.target as HTMLInputElement).files?.[0] || null
  console.log('files.value (from v-model):', files.value)
  console.log('selected file (from event):', file)
  if (!file) {
    console.log('No file selected, returning.')
    return
  }
  const err = validateFile(file)
  if (err) {
    setError(err)
    console.log('File validation error:', err)
    return
  }
  revokeObjectUrl()
  objectUrl = URL.createObjectURL(file)
  const img = imgRef.value
  if (!img) {
    console.log('imgRef.value is null, returning.')
    return
  }
  const onLoad = () => {
    img.removeEventListener('load', onLoad)
    // mountCropper() // Removed this call
    console.log('Image loaded, mountCropper called.')
  }
  const onErr = () => {
    img.removeEventListener('error', onErr)
    setError('Bild konnte nicht geladen werden.')
    console.log('Image loading error.')
  }
  img.addEventListener('load', onLoad, { once: true })
  img.addEventListener('error', onErr, { once: true })
  imageSrc.value = objectUrl
  dialog.value = true
  console.log('Dialog opened and imageSrc set.')
}

function onDrop(e: DragEvent): void {
  const f = e.dataTransfer?.files?.[0]
  if (f) {
    files.value = [f]
    onFileSelected(e) // Pass the event object
  }
}

function rotate(deg: number): void {
  if (cropper.value) cropper.value.getCropperImage()?.$rotate(deg)
}
function reset(): void {
  if (cropper.value) cropper.value.getCropperImage()?.$resetTransform()
}

function toggleAspect(): void {
  if (!allowFreeAspect.value) return
  aspectRatio.value = aspectRatio.value > 0 ? 0 : 1 // unicorn/prefer-ternary
  const selection = cropper.value?.getCropperSelection()
  if (selection) {
    selection.aspectRatio = aspectRatio.value > 0 ? aspectRatio.value : Number.NaN
  }
}

function onZoomChange(val: number): void {
  if (cropper.value) cropper.value.getCropperImage()?.$zoom(val)
}

function canvasToBlob(canvas: HTMLCanvasElement, type: OutputFormat, q: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('toBlob lieferte null'))
        resolve(blob)
      },
      type,
      type === 'image/png' ? undefined : q
    )
  })
}

function buildOutputCanvas(): HTMLCanvasElement | null {
  if (!cropper.value) return null
  const size = outputSize.value
  const base = (cropper.value.getCropperImage() as any)?.$toCanvas({ width: size, height: size })
  if (!base) return null
  if (circlePreview.value && (format.value === 'image/png' || format.value === 'image/webp')) {
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')
    if (!ctx) return base
    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(base, 0, 0, size, size)
    ctx.restore()
    return c
  }
  return base
}

async function save(): Promise<void> {
  try {
    if (!cropper.value) return
    const canvas = buildOutputCanvas()
    if (!canvas) {
      setError('Kein Canvas erzeugt')
      return
    }
    const blob = await canvasToBlob(canvas, format.value, quality.value)
    const dataUrl = canvas.toDataURL(format.value, quality.value)
    emit('update:modelValue', dataUrl)
    emit('cropped', { blob, dataUrl })
    close()
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unbekannter Fehler beim Speichern'
    setError(msg)
  }
}

watch(dialog, (open) => {
  emit('open-change', open)
  if (!open) {
    // When dialog closes
    destroyCropper()
    revokeObjectUrl()
    files.value = null
  }
})

watch(imageSrc, (newVal) => {
  if (newVal) {
    mountCropper()
  }
})

onBeforeUnmount(() => {
  destroyCropper()
  revokeObjectUrl()
})

defineExpose<{ open: () => void }>({ open })
</script>

<style scoped>
.avatar-cropper :deep(.v-avatar) {
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.crop-wrap {
  position: relative;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: repeating-conic-gradient(#f8f8f8 0 25%, #fff 0 50%) 50%/20px 20px;
}
.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #666;
  font-size: 0.95rem;
  text-align: center;
  padding: 12px;
}
.source-img {
  max-width: 100%;
}
:deep(.cropper-container) {
  width: 100% !important;
  height: 100% !important;
}
.preview {
  border: 2px solid #444;
  overflow: hidden;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
