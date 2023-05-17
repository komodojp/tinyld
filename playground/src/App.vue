<template>
  <div>
    <div class="area" >
      <div class="absolute flex w-full h-full justify-center items-center">
        <div class="w-[600px] max-w-[80vw] font-bold text-4xl z-10">
          <h1 class="text-slate-50">TinyLD Playground</h1>
          <p class="text-sm font-normal mt-2 text-slate-300">
            Tiny Language Detector, simply detect the language of a unicode UTF-8 text
          </p>
          <div class="flex justify-between mt-4">
            <div class="flex items-center px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-slate-200">
              <input id="bordered-radio-2" type="radio" v-model="flavor" value="tinyld-light" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="bordered-radio-2" class="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-800">TinyLD Light <span class="text-slate-400">~65KB</span></label>
            </div>
            <div class="flex items-center px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-slate-200">
              <input id="bordered-radio-1" type="radio" v-model="flavor" value="tinyld" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="bordered-radio-1" class="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-800">TinyLD <span class="text-slate-400">~500KB</span></label>
            </div>
            <div class="flex items-center px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-slate-200">
              <input id="bordered-radio-3" type="radio" v-model="flavor" value="tinyld-heavy" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="bordered-radio-3" class="ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-800">TinyLD Heavy <span class="text-slate-400">~2MB</span></label>
            </div>
          </div>
          <textarea
            rows="8"
            v-model="input"
            placeholder="Enter your text here"
            class="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-normal mt-5"/>

          <div v-if="results && results.length > 0" class="font-normal bg-white border shadow-sm rounded-md mt-2 px-3 py-2 text-sm">
            <ul class="list-item">
              <li v-for="(result, index) in results" :key="result.lang" class="flex items-center pt-1">
                <span style="width: 80px" class="px-2 font-semibold uppercase">
                  {{ result.lang }}
                </span>
                <div class="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                  <div v-if="index === 0" class="bg-blue-400 h-2.5 rounded-full" :style="`width: ${Math.round(result.accuracy * 10000)/100 }%`"></div>
                  <div v-else class="bg-yellow-200 h-2.5 rounded-full" :style="`width: ${Math.round(result.accuracy * 10000)/100 }%`"></div>
                </div>
                <span style="width: 80px" class="px-2">
                  {{ Math.round(result.accuracy * 10000)/100 }}%
                </span>
              </li>
            </ul>
          </div>

          <div class="flex gap-3 pt-4">
            <a href="https://github.com/komodojp/tinyld" alt="Github" target="_blank" class="text-slate-200 hover:text-slate-50">
              <v-icon label="github" :icon="{ prefix: 'fab', iconName: 'github' }" />
            </a>
            <a href="https://github.com/komodojp/tinyld/blob/develop/docs/benchmark.md" alt="Benchmark" target="_blank" class="text-slate-200 hover:text-slate-50">
              <v-icon label="benchmark" icon="chart-line" />
            </a>
            <a href="https://github.com/komodojp/tinyld/blob/develop/docs/faq.md" alt="FAQ" target="_blank" class="text-slate-200 hover:text-slate-50">
              <v-icon label="FAQ" :icon="{ prefix: 'far', iconName: 'circle-question' }" />
            </a>
            <a href="#" alt="Share" class="text-slate-200 hover:text-slate-50" @click="copy()">
              <v-icon label="Share" icon="share-from-square" />
              <span v-if="copied" class="text-slate-50 pl-2 text-lg">Copied to clipboard !</span>
            </a>
          </div>
        </div>
      </div>

      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div >
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { detectAll } from 'tinyld'
import { detectAll as detectAllLight } from 'tinyld/light'
import { detectAll as detectAllHeavy } from 'tinyld/heavy'
import { useClipboard } from '@vueuse/core'

const input = ref('')
const flavor = ref('tinyld')
const results = computed(() => {
  if (flavor.value === "tinyld-light") return detectAllLight(input.value)
  if (flavor.value === "tinyld-heavy") return detectAllHeavy(input.value)
  return detectAll(input.value)
})

const link = computed(() => {
  return `https://komodojp.github.io/tinyld/?text=${encodeURIComponent(input.value)}`
})

const clipboard = useClipboard({ source: link })

const copied = ref(false)
const copy = () => {
  clipboard.copy()
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.area{
    background: #4e54c8;
    background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
    width: 100%;
    height:100vh;
}

.circles{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.circles li{
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;

}

.circles li:nth-child(1){
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
}


.circles li:nth-child(2){
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
}

.circles li:nth-child(3){
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
}

.circles li:nth-child(4){
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
}

.circles li:nth-child(5){
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6){
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
}

.circles li:nth-child(7){
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8){
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9){
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10){
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}

@keyframes animate {
    0%{
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }
    100%{
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }
}
</style>
