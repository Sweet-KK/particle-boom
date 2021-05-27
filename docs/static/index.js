window.onload = function () {
  var canvas = document.getElementById('canvas')
  var boomOption = {}
  var canvas2 = document.getElementById('canvas2')
  var boomOption2 = {
    // 粒子间隔
    gap: 6,
    // 粒子大小
    radius: 3,
    // 最小水平喷射速度
    minVx: -20,
    // 最大水平喷射速度
    maxVx: 20,
    // 最小垂直喷射速度
    minVy: -20,
    // 最大垂直喷射速度
    maxVy: 20,
    onBoomEnd: function () {
      console.log('end2')
    }
  }
  var ctx = canvas.getContext('2d')

  // 方案一: 调用内置方法绘制图片到canvas,将以图片宽高设置canvas的宽高
  ParticleBoom.drawPic(canvas2, './static/dragon.jpeg').then(function (canvas2Dom) {
    new ParticleBoom(
      canvas2,
      boomOption2,
      // 重复调用无效,传入以该值作为key区分,可同时操作多个canvas
      2
    )
  })

  // 方案二: 根据实际需求自己绘制canvas
  var image = new Image()
  image.src = './static/dragon.jpeg'
  image.onload = function () {
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    setTimeout(() => {
      // 自定义动画
      canvas.classList.add('animate__animated', 'animate__swing')
    }, 30)

    // 动画结束后执行粒子化爆炸效果
    canvas.addEventListener('animationend', function () {
      canvas.classList.remove('animate__animated')
      canvas.classList.remove('animate__swing')

      new ParticleBoom(canvas, {
        onBoomEnd: function () {
          console.log('end1')
        }
      })
      // 重复调用无效
      new ParticleBoom(canvas, {
        onBoomEnd: function () {
          console.log('end1')
        }
      })
    })
  }




  window.draw = function (type) {
    ParticleBoom.drawPic({ 1: canvas, 2: canvas2 }[type], './static/dragon.jpeg')
  }
  window.boom = function (type) {
    const typeMap = {
      1: {
        canvas: canvas,
        option: boomOption
      },
      2: {
        canvas: canvas2,
        option: boomOption2
      }
    }
    new ParticleBoom(typeMap[type].canvas, typeMap[type].option, type)
  }
}