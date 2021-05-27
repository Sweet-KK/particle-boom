# particle-boom

[![NPM Version](https://badge.fury.io/js/particle-boom.svg)](https://www.npmjs.com/package/particle-boom)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Sweet-KK/particle-boom/pulls)


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Doc](#doc)
- [License](#license)

## Introduction

canvas粒子爆炸，根据画布点阵信息转化成粒子，再模拟一个爆炸效果。

[⬆ Back to Top](#table-of-contents)

## Features
- ParticleBoom.drawPic() 绘制图片到canvas
- new ParticleBoom() 粒子化爆炸

[⬆ Back to Top](#table-of-contents)

## Install

```
npm install particle-boom
```

[⬆ Back to Top](#table-of-contents)

## Usage

```
<!-- 浏览器 -->
<script src="lib/particle-boom.iife.js"></script>
<script>
  // 传入canvas的id或dom
  new ParticleBoom('canvas', {
    // speed: Number, // 爆炸绘制的定时器间隔
    // gap: Number, // 粒子间隔
    // radius: Number, // 粒子大小
    // minVx: Number, // 最小水平喷射速度
    // maxVx: Number, // 最大水平喷射速度
    // minVy: Number, // 最小垂直喷射速度
    // maxVy: Number, // 最大垂直喷射速度
    // edgeOpacity: false, // 是否canvas边缘羽化
    onBoomEnd () {
      console.log('爆炸结束了')
    },
    filterFunc ({ r, g, b, a }) {
      // 不是透明且不是白色才需要提取
      return a !== 0 && !(r === 255 && g === 255 && b === 255)
    }
  }, key)  // key标识
</script>


<!-- npm -->
<script>
import ParticleBoom from 'particle-boom'
export default {
  methods: {
    draw () {
      return ParticleBoom.drawPic(this.$refs.canvas, imgSrc)
    },
    boom () {
      new ParticleBoom(this.$refs.canvas)
    }
  }
}
</script>
```

[⬆ Back to Top](#table-of-contents)

## doc

- [doc](https://Sweet-KK.github.io/particle-boom/)

[⬆ Back to Top](#table-of-contents)

## License

[MIT](./LICENSE)

[⬆ Back to Top](#table-of-contents)
