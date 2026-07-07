<script setup lang="ts">
import { computed } from 'vue'
import { contentStore } from '../content'
import { urlParams } from '../param'

// geojsonから表示できるパラメーターを抽出する。
// NOと/^_*/を除外する
const contents = computed(() => {
  const v = {}
  if (contentStore === null) {
    return v
  }

  for (const k of Object.keys(contentStore.current.properties)) {
    if (k === 'NO' || k.indexOf('_') === 0) {
      continue
    }
    v[k] = contentStore.current.properties[k]
  }

  return v
})

// コピーボタンを押された時の動作
const onCopy = (key) => {
  if (!navigator.clipboard) {
    return
  }
  navigator.clipboard.writeText(contents.value[key])
}

// ページシェアボタンを押された時の動作
const copyPage = () => {
  if (!navigator.clipboard) {
    return
  }
  urlParams.setParam('center', contentStore.current.geometry.coordinates)
  navigator.clipboard.writeText(urlParams.getUrl())
}
</script>

<template>
  <div id="inform">
    <div class="_share" v-if="contentStore.current !== null">
      <a @click="copyPage"><i class="bi bi-share"></i> ページURLをコピー</a>
    </div>
    <div v-if="contentStore.current !== null">
      <div v-for="(value, key) in contents">
        <dl class="_item">
          <dt>{{ key }}</dt>
          <dd>
            {{ value
            }}<span v-if="value != ''" @click.prevent="() => onCopy(key)"
              ><i class="bi bi-copy"></i
            ></span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#inform {
  ._share {
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: right;
    a {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  ._item {
    margin-bottom: 5px;
    dt {
      min-width: 100px;
      background-color: #e7e8ff;
    }
    dd {
      font-size: 1.1em;
      background-color: #eee;
      min-height: calc(1.1em + 6px);
      margin-left: 0px;
      text-indent: 1.5em;
      padding-top: 6px;
      overflow-wrap: anywhere;
      word-break: normal;
      line-break: strict;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        padding-right: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
