// 导航栏点击切换 小红线效果
let arrowWown = document.querySelector('#arrowWown');

// (function (window) {
//     let tabsList = document.querySelector('.tabs-list');
//     tabsList.addEventListener('touchstart', function (e) {
//         let targetItem = e.target
//         if (targetItem.tagName === 'A') {
//             // 获得 a 的自定义属性
//             let itemIndex = parseInt(targetItem.dataset.id)
//             document.querySelectorAll('.tabs-list-content a').forEach(ele => {
//                 ele.classList.remove('active-text')
//             })
//             targetItem.classList.add('active-text')
//             redLine.style.transform = `translateX(${18 * itemIndex}vw)`
//         }
//     })
// })(window);

// 页面数据渲染内容
(function (window) {
    // 导航栏内容数据渲染
    let tabsListContent = document.querySelector('.tabs-list-content')
    let navData = res.nav
    let lanMu = document.querySelector('.lanMu')
    lanMu.innerHTML = navData.map(function (ele, index, obj) {
        return `<a href='#'>${ele}</a>`
    }).join('')

    let navArr = navData.map(function (ele, index, obj) {
        return `<a class='${index === 0 ? 'active-text' : ''}'  data-id='${index}' href='#'>${ele}</a>`
    })




    navArr.push(`<div  class="red-line"></div>`)
    tabsListContent.innerHTML = navArr.join('')
    let tabsList = document.querySelector('.tabs-list');
    let redLine = document.querySelector('.red-line');
    tabsList.addEventListener('touchstart', function (e) {
        let targetItem = e.target
        if (targetItem.tagName === 'A') {
            // 获得 a 的自定义属性
            let itemIndex = parseInt(targetItem.dataset.id)
            document.querySelectorAll('.tabs-list-content a').forEach(ele => {
                ele.classList.remove('active-text')
            })
            targetItem.classList.add('active-text')
            redLine.style.transform = `translateX(${16 * itemIndex}vw)`
        }
    })


    // tab 栏滑动效果
    tabsListContent.addEventListener('touchstart', function (e) {

        let initTranslateXValue = (tabsListContent.style.transform).slice(11, -3) ? parseInt((tabsListContent.style.transform).slice(11, -3)) : 0
        // 鼠标第一次点击的位置
        let startDiatanceX = e.changedTouches[0].pageX - initTranslateXValue

        // 最大移动的位置，最多只能移动 (tabsList的长度-tabsList的长度)
        let maxTranslateXValue = tabsListContent.scrollWidth - tabsList.offsetWidth

        function moveCallBack(e) {
            // 移动的距离 = 鼠标移动的位置 - 第一次按下的位置
            let moveDistance = startDiatanceX - e.changedTouches[0].pageX
            moveDistance = moveDistance > maxTranslateXValue ? maxTranslateXValue : moveDistance
            tabsListContent.style.transform = `translateX(-${moveDistance}px)`
        }
        // 鼠标滑动调用移动函数
        document.addEventListener('touchmove', moveCallBack)

        document.addEventListener('touchend', function (e) {
            document.removeEventListener('touchmove', moveCallBack)
        })
    })




    // 视频卡片页面渲染
    let videoList = document.querySelector('.video-list')
    // 有关视频的数据
    let videoData = res.data
    let videoListArr = videoData.map(function (ele, index, obj) {
        return `<a href="#" class="video-item">
                  <div class="card">
                      <img src='${ele.pic}' alt="">
                      <!-- 播放量 -->
                      <div class="count">
                          <span><i class="iconfont icon_shipin_bofangshu"></i>${ele.hot_desc}</span>
                          <span><i class="iconfont icon_shipin_danmushu"></i>${ele.duration}</span>
                      </div>
                  </div>
                  <p class="title ellipsis-2">
                    ${ele.title}
                  </p>
              </a>`

    }).join('')
    videoList.innerHTML = videoListArr


})(window);





// 导航栏下拉内容与 遮罩层的显示与隐藏
(function (window) {
    let arrowWown = document.querySelector('#arrowWown')
    let arrowUp = document.querySelector('#arrowUp')
    let mHomeMask = document.querySelector('.m-home-mask')
    // 卡片
    let navContainer = document.querySelector('.nav-container')
    console.log(arrowUp);
    console.log(arrowWown);
    console.log(navContainer);
    arrowWown.addEventListener('touchstart', function (e) {
        e.stopPropagation()
        navContainer.style.animation = `animiateDown 0.5s ease-out forwards`
        mHomeMask.style.display = 'block'
    })
    arrowUp.addEventListener('touchstart', function (e) {
        e.stopPropagation()
        navContainer.style.animation = `animiateUp 0.5s ease-out forwards`
        mHomeMask.style.display = 'none'
    })
    document.documentElement.addEventListener('touchstart', function (e) {
        navContainer.style.animation = `animiateUp 0.5s ease-out forwards`
        mHomeMask.style.display = 'none'
    })
})(window);