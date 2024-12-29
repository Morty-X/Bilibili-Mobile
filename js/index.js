(function (window) {

    /**
     * @description: 检测数据类型
     * @param {*} data 被检测的数据
     * @return {*} 数据类型
     */
    function typeOf(data) {
        return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
    }

    // 定义按照指定要求创建节点的函数createElement
    /**
     * @description: 指定要求创建节点
     * @param {*} tag 标签名(必传项)
     * @param {*} attrs 属性值对象
     * @param {*} children  子元素
     * @return {*} 按照指定要求创建的节点
     */
    function createElement(tag, attrs, children) {
        // 检测tag是否合法
        if (typeOf(tag) !== 'string') throw new Error('标签名不合法');
        if (tag instanceof HTMLUnknownElement) throw new Error('标签名不合法');
        // 创建节点
        let element = document.createElement(tag)
        // 检测attr是否是对象(非必选项)
        attrs = typeOf(attrs) === 'object' ? attrs : {}
        // 给节点添加属性值

        Object.entries(attrs).forEach(function (item) {
            let attrName = item[0]
            let attrValue = item[1]
            // 判断 属性值为对象的情况
            if (typeOf(attrValue) === 'object') {
                let attrValueStr = ''
                Object.entries(attrValue).forEach(function (ele) {
                    attrValueStr += ele.join(':') + ';'
                })
                attrValue = attrValueStr
            }
            element[attrName] = attrValue
        })

        // 子节点
        if (typeOf(children) === 'string') {
            element.innerText = children
        }
        return element

    }
    let divNode = createElement('div', {
        className: 'tabNav', id: 888, style: {
            width: '20px',
            height: '80px',
            background: 'red'
        }
    }, '哈哈哈哈哈哈')
    console.log(divNode);


    /**
     * @description: tab栏最小translateX移动距离
     * @param {*} element tab栏 DOM
     * @return {*}
     */
    function getMinTranslateDistance(element) {
        let containerRectInfo = element.parentElement.getBoundingClientRect()
        let contentRectInfo = element.getBoundingClientRect()
        let containerWidth = containerRectInfo.width
        let contentWidth = contentRectInfo.width
        let minTranslateDistance = containerWidth - contentWidth
        return minTranslateDistance
    }


    /**
     * @description: 限定tab栏移动的距离
     * @param {*} min 最小距离
     * @param {*} max 最大距离
     * @return {*} 
     */
    function limitTabTranslateDiatance(min, max, num) {
        if (num > max) {
            num = max
        } else if (num < min) {
            num = min
        }
        return num
    }

    // tab栏 点击和滑动事件所共有的属性
    let prevTranslateX = 0
    /**
     * @description:  tab 栏滑动的处理函数
     * @param {*} element 事件源
     * @return {*}
     */
    function initScroll(element) {
        // 移动滚动的距离
        // let scrollDiatance = 0
        // 鼠标滑动距离
        let distanceX = 0

        let minTranslateDistance = getMinTranslateDistance(element)


        // 计算鼠标按下去的起始位置 和 最后鼠标移动的位置 ，得到
        element.addEventListener('touchstart', function (event) {
            // 触摸开始时要去掉tab栏滑动的过渡效果
            element.style.transition = 'unset'
            function moveCallBack(e) {
                distanceX = e.touches[0].clientX - event.touches[0].clientX
                // tab 栏应该往右走的距离是 scrollDiatance(上次已经滑动的距离) + distanceX

                // 限定tab栏移动的距离
                let tempDistanceX = prevTranslateX + distanceX
                tempDistanceX = limitTabTranslateDiatance(minTranslateDistance, 0, tempDistanceX)
                element.style.transform = `translate3d(${tempDistanceX}px,0,0)`
            }
            document.addEventListener('touchmove', moveCallBack)
            document.addEventListener('touchend', function (event) {
                this.removeEventListener('touchmove', moveCallBack)
                // 鼠标抬起后 将tab 栏已经滑动的距离进行叠加
                prevTranslateX += distanceX
                distanceX = 0
            })

        })
    }

    // 处理点击tan栏选项时文字样式改变的函数
    function changeTabTextStyle(item) {
        let items = document.querySelectorAll(item)
        items.forEach(function (ele) {
            console.log(ele);
            if (ele.classList.contains('activeText')) {
                ele.classList.remove('activeText')
            }
        })
        let nodeItem = document.querySelector(item)
        nodeItem.classList.add('activeText')
    }

    /**
     * @description: 点击事件的处理函数
     * @param {*} element
     * @return {*}
     */
    function bindEvent(element, redLine) {
        let parentRectInfo = element.parentElement.getBoundingClientRect()
        // 获取tab栏父级元素的中间位置
        let centerX = parentRectInfo.width / 2
        let parentLeft = parentRectInfo.left
        // 此次滑动的距离
        let translateX = 0
        let minTranslateDistance = getMinTranslateDistance(element)
        element.addEventListener('click', function (e) {
            if (e.target.classList.contains('tabs-item')) {
                // 被点击的元素信息
                let itemRectInfo = e.target.getBoundingClientRect()
                // 被点击的元素的left值
                let itemLeft = itemRectInfo.left
                // 被点击的元素相对与 tabs - container盒子的左边距
                // console.log(itemLeft - parentLeft);
                /**
                 *   被点击元素需要移动到中间还差的距离
                 *    console.log(centerX - (itemLeft - parentLeft)); 
                 **/
                // tab 栏移动的距离
                translateX = centerX - (itemLeft - parentLeft) - itemRectInfo.width / 2;
                prevTranslateX += translateX
                // 限定 tab栏 滑动范围
                prevTranslateX = limitTabTranslateDiatance(minTranslateDistance, 0, prevTranslateX)
                element.style.cssText = `transform:translate3d(${prevTranslateX}px,0,0);transition: all 300ms;`
                // 第一次居中正常 基于transformX 0 => transformX 100
                // 第二次居中异常 计算时 应该基于上一次的transformX 100，
                // 但是移动的时候是基于 transformX 0 ，所以我们需要记录上一次的
                // 移动距离，再与此次移动的距离叠加

                // 修改被点击后样式

                let tabsItems = document.querySelectorAll('.tabs-item')
                tabsItems.forEach(function (ele) {
                    ele.classList.remove('activeText')
                })
                e.target.classList.add('activeText')

                redLine.style.transform = `translateX(${26 * e.target.dataset.id}vw)`

            }
        })
    }

    // 下方小红线的逻辑
    function initRedLine(element) {
        element.style.cssText = `position: absolute;
                                 left: 0;
                                 bottom: 1px;
                                 width: 14vw;
                                 height: 1vw;
                                 background-color: #f1468d;
                                 transition: all ease-in 300ms;`;
    }


    function initDrawer(parent, data, callback) {
        let isExpand = false
        let drawer = createElement('div', { className: 'drawer' })
        let content = createElement('div', { className: 'drawer-content' })
        // 收起抽屉的箭头   
        let arrowUp = createElement('div', { className: ' packUp' })
        arrowUp.innerHTML = ` <svg class='arrowUp-Down arrowUp' xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" >
                                    <use href="#arrow-down" />
                               </svg >`;

        data.forEach(function (item) {
            let itemNode = createElement('div', { className: 'item', _customerData: item }, item)
            content.appendChild(itemNode)
        })
        drawer.appendChild(content)
        drawer.appendChild(arrowUp)
        parent.style.position = 'relative'
        parent.appendChild(drawer)
        function hide() {
            drawer.style.transform = `translate3d(0,-100%,0)`
            isExpand = false
        }
        drawer.addEventListener('click', function (e) {
            if (e.target.className === 'item') {
                hide()
                document.querySelector('.overMask').style.display = 'none'
                typeof callback === 'function' && callback(e.target._customerData)
            } else if (e.target.tagName === 'svg') {
                hide()
            }
        })
        //    点击显示出来的蒙版后，抽屉也会消失

        return {
            show: function () {
                drawer.style.transform = `translate3d(0,0,0)`
                isExpand = true
            }
        }
    }


    // 定义一个函数 initTabs,渲染tab栏 制定一个挂载点 渲染
    /**
     * @description: 初始化tab栏 
     * @param {*} el  挂载点(渲染的位置，必传项)
     * @param {*} config tab栏 配置信息
     * @return {*} 
     */
    function initTabs(el, config) {
        let root = null
        // 检测 el是否是一个合法的 DOM
        if (el instanceof HTMLElement) {
            root = el
        } else if (typeOf(el) === 'string') {
            // 如果是一个字符串，那么在 document中通过 el查询 dom节点
            root = document.querySelector(el)
        }
        // 如果都不是
        if (!root) throw new Error('el必须是一个存在的元素')

        // 检测 config 配置项
        if (!config || typeOf(config.dataSource) !== 'array') throw new Error('config.dataSource必须是数组')

        // 创建  tab栏 结构
        let wrapper = createElement('div', { className: 'tabs-wrapper' })

        let container = createElement('div', { className: 'tabs-container' })
        //控制抽屉显示/隐藏的图标
        let switchIcon = createElement('div', { className: 'tabs-switch_expand' })

        switchIcon.innerHTML = `<svg class='arrowUp-Down' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <use href="#arrow-down" />
        </svg>`



        let content = createElement('div', { className: 'tabs-content' })
        config.dataSource.forEach(function (data, index) {
            let tabsItem = createElement('div', { className: 'tabs-item', dataset: { id: index } }, data)
            // 给每个选项添加自定义属性 id 方便小红线移动
            tabsItem.dataset.id = index
            content.appendChild(tabsItem)
        })
        // 下方小红线
        let redLine = createElement('div', { className: 'redLine' })
        content.appendChild(redLine)


        // 初始化一个抽屉结构(传入的参数为该抽屉结构的父元素)
        var drawer = initDrawer(wrapper, config.dataSource, config.callback)
        container.appendChild(content)

        container.appendChild(switchIcon)
        wrapper.appendChild(container)
        root.parentElement.replaceChild(wrapper, root)

        // tab 栏滑动的逻辑
        initScroll(content)
        bindEvent(content, redLine)

        // 下方小红线的逻辑
        initRedLine(redLine)
        // 抽屉开关的逻辑
        console.log(drawer);
        switchIcon.addEventListener('click', drawer.show)

    }

    console.log(res.nav);
    initTabs('.tabs', {
        dataSource: res.nav,
        callback: function (e) {
            console.log(e);
        }
    })

    // 初始化蒙版
    function initMask() {
        let maskLayer = createElement('div', { className: 'overMask' })
        // 抽屉
        let drawer = document.querySelector('.drawer')
        console.log(drawer);

        document.documentElement.appendChild(maskLayer)
        maskLayer.addEventListener('click', function () {
            maskLayer.style.display = 'none'
            drawer.style.transform = `translate3d(0,-100%,0)`
        })

        // 抽屉开关
        let switchIcon = document.querySelector('.tabs-switch_expand')
        console.log(switchIcon);
        switchIcon.addEventListener('click', function () {
            maskLayer.style.display = 'block'
        })
        let packUpIcon = document.querySelector('.packUp')
        console.log(packUpIcon);
        packUpIcon.addEventListener('click', function () {
            maskLayer.style.display = 'none'
            drawer.style.transform = `translate3d(0,-100%,0)`
        })
    };
    // 初始化遮罩层
    initMask()
    // 初始化卡片
    /**
     * @description: 初始化卡片结构
     * @param {*} el 挂载点
     * @param {*} config 配置项
     * @return {*}
     */
    function initCard(el, config) {
        let root = null
        // 检测 el是否是一个合法的 DOM
        if (el instanceof HTMLElement) {
            root = el
        } else if (typeOf(el) === 'string') {
            // 如果是一个字符串，那么在 document中通过 el查询 dom节点
            root = document.querySelector(el)
        }
        // 如果都不是
        if (!root) throw new Error('el必须是一个存在的元素')
        // 检测 config 配置项
        if (!config || typeOf(config.dataSource) !== 'array') throw new Error('config.dataSource必须是数组')
        let mHome = createElement('div', { className: 'm-home' })
        let fragement = document.createDocumentFragment()
        config.dataSource.forEach(function (ele) {
            let cardVideo = createCard(ele)
            fragement.appendChild(cardVideo)
        })
        mHome.appendChild(fragement)
        root.parentElement.replaceChild(mHome, root)
    }
    initCard('.mainBody', {
        dataSource: res.data
    })


    // 生成一张卡片
    function createCard(elementCardData) {
        // 生成卡片结构

        let videoList = createElement('div', { className: 'video-list' })
        let videoItem = createElement('div', { className: 'video-item' })
        let card = createElement('div', { className: 'card' })
        let imgInfo = createElement('img', { className: 'card' })
        imgInfo.src = elementCardData.pic
        let count = createElement('div', { className: 'count' })
        count.innerHTML = `<span><i class="boFangNum iconfont icon_shipin_bofangshu"></i>${handleBoFangNum(elementCardData.stat.view)}</span>
                        <span><i class="pingLunNum iconfont icon_shipin_danmushu"></i>${elementCardData.stat.danmaku}</span>`;
        let titleNode = createElement('p', { className: 'title ellipsis-2' })
        titleNode.innerHTML = elementCardData.title
        videoList.appendChild(videoItem)
        videoItem.appendChild(card)
        videoItem.appendChild(titleNode)
        card.appendChild(imgInfo)
        card.appendChild(count)
        return videoList
    }


    // 对播放量数据进行处理的函数
    function handleBoFangNum(num) {
        if (typeOf(num) !== 'number') {
            throw new Error("非数字");
        }
        let numStr = num.toString()
        let len = numStr.length
        if (len === 5) {
            numStr = numStr[0] + '.' + numStr[1] + '万'
        } else if (len === 6) {
            numStr = numStr.slice(0, 2) + '.' + numStr[2] + '万'
        } else if (len === 7) {
            numStr = numStr.slice(0, 3) + '万'
        } else if (len === 8) {
            numStr = numStr.slice(0, 4) + '万'
        } else if (len === 9) {
            numStr = numStr.slice(0, 1) + '.' + '亿'
        } else if (len === 10) {
            numStr = numStr.slice(0, 2) + '.' + '亿'
        } else if (len === 11) {
            numStr = numStr.slice(0, 3) + '.' + '亿'
        }
        return numStr
    }

    // 页面加载完成后 底部模块(动画按钮) 逻辑
    let popingBox = document.querySelector('.app')
    console.log(popingBox);
    window.addEventListener("load", (event) => {
        popingBox.style.animation = ` popping 0.5s ease-in 1 forwards`
    });

}(window));