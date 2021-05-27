const getEl = (el) => {
  let res = el || null
  if (typeof el === 'string') res = document.querySelector(el)
  if (res) return el
  throw new Error('请传入canvas元素或选择器!')
}

export default class ParticleBoom {
  constructor (el, options = {}, key = 0) {
    if (ParticleBoom.hasBoom[key]) return
    ParticleBoom.hasBoom[key] = false
    this.canvas = getEl(el)
    this.w = this.canvas.width
    this.h = this.canvas.height
    this.ctx = this.canvas.getContext('2d')
    const widthAndHeightMinVal = Math.min(this.w, this.h)
    const defaultRadius = parseInt(widthAndHeightMinVal / 100)
    const defaultGap = defaultRadius * 4
    const defaultV = defaultRadius * 6
    this.options = Object.assign(
      {
        // 爆炸绘制的定时器间隔
        speed: 60,
        // 粒子间隔
        gap: defaultGap,
        // 粒子大小
        radius: defaultRadius,
        // 最小水平喷射速度
        minVx: -defaultV,
        // 最大水平喷射速度
        maxVx: defaultV,
        // 最小垂直喷射速度
        minVy: -defaultV,
        // 最大垂直喷射速度
        maxVy: defaultV,
        // 是否canvas边缘羽化
        edgeOpacity: false,
        onBoomEnd () {
          console.log('爆炸结束了')
        },
        filterFunc ({ r, g, b, a }) {
          // 不是透明且不是白色才需要
          return a !== 0 && !(r === 255 && g === 255 && b === 255)
        }
      },
      options
    )
    this.key = key
    this.init()
  }

  init () {
    // 根据参数初始化速度数组
    const randomVx = this.initRandomVx(this.options)
    const randomVy = this.initRandomVy(this.options)

    ParticleBoom.hasBoom[this.key] = true
    // 初始化粒子数组
    const balls = this.initParticle(randomVx, randomVy, this.options)
    this.intervalFunc(this.canvas, this.ctx, balls, this.options)
  }

  /**
   * 根据参数初始化垂直速度数组
   * @return randomVy 垂直速度数组
   */
  initRandomVy (options) {
    const randomVy = []
    for (let i = options.minVy; i <= options.maxVy; i++) {
      randomVy.push(i)
    }
    return randomVy
  }

  /**
   * 根据参数初始化水平速度数组
   * @return randomVx 水平速度数组
   */
  initRandomVx (options) {
    const randomVx = []
    for (let i = options.minVx; i <= options.maxVx; i++) {
      randomVx.push(i)
    }
    return randomVx
  }

  // 初始化粒子数组
  initParticle (randomVx, randomVy, options) {
    const balls = []
    const { radius, gap } = options
    const { ctx, w: width, h: height } = this
    const imageData = ctx.getImageData(0, 0, width, height).data
    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const position = (width * y + x) * 4
        const r = imageData[position]
        const g = imageData[position + 1]
        const b = imageData[position + 2]
        const a = imageData[position + 3] / 255

        if (this.options.filterFunc({ r, g, b, a })) {
          balls.push({
            translateX: radius / 2,
            translateY: radius / 2,
            x,
            y,
            g: 2.5 + Math.random(),
            vx: randomVx[Math.floor(Math.random() * randomVx.length)],
            vy: randomVy[Math.floor(Math.random() * randomVy.length)],
            color: `rgba(${r},${g},${b},${a})`
          })
        }
      }
    }
    return balls
  }

  // 调用爆炸函数，构造定时器更新爆炸粒子
  intervalFunc (canvas, ctx, balls, options) {
    this.interval = setInterval(() => {
      this.drawParticle(canvas, ctx, balls, options)
      this.updateBalls(canvas, balls, options)
    }, options.speed)
  }

  // 绘制爆炸粒子
  drawParticle (canvas, ctx, balls, options) {
    let count = 0
    // 更新画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < balls.length; i++) {
      // 为方便绘制圆,先平移画布
      ctx.translate(balls[i].translateX, balls[i].color.translateY)
      ctx.fillStyle = balls[i].color
      ctx.beginPath()
      ctx.arc(balls[i].x, balls[i].y, options.radius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
      // 绘制完毕还原画布
      ctx.translate(-balls[i].translateX, -balls[i].color.translateY)

      if (balls[i].x < (0 - options.radius) || balls[i].x > (canvas.width + options.radius) || balls[i].y > (canvas.height + options.radius) || balls[i].y < (0 - options.radius)) {
        count++
      }
    }
    if (count === balls.length) {
      clearInterval(this.interval)
      ParticleBoom.hasBoom[this.key] = false
      this.options.onBoomEnd()
    }
  }

  // 根据参数水平速度和竖直速度更新粒子位置
  updateBalls (canvas, balls, options) {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].x < -options.radius || balls[i].x > canvas.width + options.radius || balls[i].y < -options.radius || balls[i].y > canvas.height + options.radius) {
        continue
      }
      // 改变粒子位置
      balls[i].x += balls[i].vx
      balls[i].y += balls[i].vy
      balls[i].vy += balls[i].g
      // 边缘羽化
      if (options.edgeOpacity) {
        const re = /(rgba\(\d+,\d+,\d+,)(-?(\d+\.)?\d+)/g
        const reArr = re.exec(balls[i].color)
        const beforeRgba = reArr[1]
        let opacity = reArr[2]
        if (parseInt(reArr[2] < 0.1)) {
          continue
        }
        if (balls[i].x + options.radius <= canvas.width / 2 && balls[i].y + options.radius <= canvas.height / 2) {
          opacity = (balls[i].x / canvas.width * 2) * (balls[i].y / canvas.height * 2)
        } else if (balls[i].x + options.radius >= canvas.width / 2 && balls[i].y + options.radius <= canvas.height / 2) {
          opacity = ((canvas.width - balls[i].x) / canvas.width * 2) * (balls[i].y / canvas.height * 2)
        } else if (balls[i].x + options.radius <= canvas.width / 2 && balls[i].y + options.radius >= canvas.height / 2) {
          opacity = (balls[i].x / canvas.width * 2) * ((canvas.height - balls[i].y) / canvas.height * 2)
        } else {
          opacity = ((canvas.width - balls[i].x) / canvas.width * 2) * ((canvas.height - balls[i].y) / canvas.height * 2)
        }
        opacity = opacity * (1.2 + Math.random())
        balls[i].color = `${beforeRgba}${opacity})`
      }
    }
  }
}

ParticleBoom.hasBoom = {}
ParticleBoom.drawPic = (el, src) => {
  const canvas = getEl(el)
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.src = src
  return new Promise((resolve, reject) => {
    try {
      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0)
        resolve(canvas)
      }
    } catch (error) {
      reject(error)
    }
  })
}
