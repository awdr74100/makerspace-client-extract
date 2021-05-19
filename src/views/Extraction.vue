<template>
  <div class="container-fluid px-0">
    <div class="d-flex flex-column align-items-center justify-content-center">
      <div class="p-3 w-100">
        <select v-model="deviceId" class="form-select">
          <option value="" disabled>-- Select Camera --</option>
          <option
            v-for="camera in cameras"
            :key="camera.deviceId"
            :value="camera.deviceId"
          >
            {{ camera.label }}
          </option>
        </select>
      </div>
      <div v-if="errorMessage" class="p-3 text-danger">{{ errorMessage }}</div>
      <div v-else class="p-3 text-danger">請在人臉檢測框為綠色時進行提取！</div>
      <div
        class="
          overlay
          position-relative
          mx-3
          d-flex
          align-items-center
          justify-content-center
        "
      >
        <vue-web-cam
          ref="webcam"
          class="webcam position-relative"
          width="100%"
          height="100%"
          :device-id="deviceId"
          @cameras="onCameras"
          @camera-change="onCameraChange"
          @error="onError"
          @notsupported="onError"
          @video-live="onVideoLive"
        />
      </div>
      <div class="px-3 my-4">
        <button
          :disabled="anonymous || !!errorMessage"
          class="
            btn btn-teal
            text-white
            d-flex
            align-items-center
            justify-content-center
          "
          @click.prevent="onCapture"
        >
          <span>提取特徵</span>
          <div
            v-if="spinner"
            class="spinner-border spinner-border-sm text-white ms-2"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as faceapi from '@vladmandic/face-api';
import { mapState } from 'vuex';
import delay from '@/utils/delay';

export default {
  beforeRouteEnter(to, from, next) {
    const { path, hash } = to;
    if (hash && hash[0] === '#') return next(`${path}?${hash.substring(1)}`);
    return next();
  },
  data: () => ({
    deviceId: '',
    cameras: [],
    spinner: false,
    anonymous: false,
    errorMessage: '',
    loadedModels: false,
  }),
  computed: {
    ...mapState('oauth', ['user']),
  },
  created() {
    const { query } = this.$route;
    if (!query.access_token) {
      this.$toast.warning('請先登入');
      this.$router.push({ path: '/' });
    }
  },
  methods: {
    onCameras(cameras) {
      this.cameras = cameras;
      this.deviceId = cameras[0].deviceId;
    },
    onCameraChange() {
      this.$store.commit('SET_LOADING', { status: '相機啟動中', active: true });
    },
    onError(error) {
      this.errorMessage = error;
      this.$store.commit('SET_LOADING', { status: '', active: false });
    },
    async onVideoLive() {
      if (!this.user.id) {
        this.$store.commit('SET_LOADING', {
          status: '身分確認中',
          active: true,
        });

        const { access_token: accessToken } = this.$route.query;

        await this.$store.dispatch('oauth/getUserInfo', { accessToken });

        if (!this.user.email.includes('@stust.edu.tw')) {
          this.$toast.warning('目前暫不開放給外部人員註冊');
          this.anonymous = true;
        }
      }

      if (!this.loadedModels) await this.loadModels();

      const webcam = document.querySelector('.webcam');
      const canvas = document.querySelector('.canvas');
      const overlay = document.querySelector('.overlay');

      const createCanvas = faceapi.createCanvasFromMedia(webcam);

      createCanvas.classList.add('canvas', 'position-absolute');
      const createCanvasSize = {
        width: webcam.clientWidth,
        height: webcam.clientHeight,
      };

      faceapi.matchDimensions(createCanvas, createCanvasSize);

      if (canvas) overlay.removeChild(canvas);
      overlay.appendChild(createCanvas);

      this.$store.commit('SET_LOADING', { status: '', active: false });

      this.faceDetection(webcam, createCanvas, createCanvasSize, 500);
    },
    async loadModels() {
      this.$store.commit('SET_LOADING', { status: '模型載入中', active: true });

      await Promise.all([
        faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);

      this.loadedModels = true;
    },
    faceDetection(webcam, createCanvas, createCanvasSize, ms) {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          webcam,
          new faceapi.TinyFaceDetectorOptions(),
        );

        const resizeDetections = faceapi.resizeResults(
          detections,
          createCanvasSize,
        );

        createCanvas
          .getContext('2d')
          .clearRect(0, 0, createCanvasSize.width, createCanvasSize.height);

        resizeDetections.forEach((detection) => {
          const score = Math.ceil(detection.score * 100) / 100;

          new faceapi.draw.DrawBox(
            {
              x: detection.box.x,
              y: detection.box.y,
              width: detection.box.width,
              height: detection.box.height,
            },
            { boxColor: score > 0.85 ? '#20c997' : '#6c757d' },
          ).draw(createCanvas);

          new faceapi.draw.DrawTextField(
            [`${score}`],
            detection.box.bottomLeft,
            {
              backgroundColor: score > 0.85 ? '#20c997' : '#6c757d',
            },
          ).draw(createCanvas);
        });
      }, ms);
    },
    async onCapture() {
      const vm = this;
      const base64Array = [];
      const imageLength = 5;
      vm.$store.commit('SET_FEATURES', { features: [] });
      vm.spinner = true;

      for (let i = 0; i < imageLength; i += 1) {
        base64Array.push(vm.$refs.webcam.capture());
        // eslint-disable-next-line no-await-in-loop
        if (i !== imageLength - 1) await delay(500);
      }

      const features = await Promise.all(
        base64Array.map((base64) => {
          const img = document.createElement('img');
          img.src = base64;
          return faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true)
            .withFaceDescriptor();
        }),
      );

      if (features.includes(undefined)) {
        vm.spinner = false;
        this.$toast.error('特徵提取失敗，請在試一次');
        return;
      }

      vm.$store.commit('SET_FEATURES', { features });

      vm.spinner = false;

      this.$store.commit('modal/OPEN_MODAL', { modal: 'postModal' });
    },
  },
};
</script>
