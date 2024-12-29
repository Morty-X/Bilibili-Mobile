
/**
 * @description: 判断数据类型
 * @param {*} data
 * @return {*}
 */
function typeOf(data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}

/**
 * @description: 创建指定 标签名 属性 ，子节点的DOM节点
 * @param {*} tag 标签名
 * @param {*} attrs 属性
 * @param {*} children 子节点
 * @return {*} 创建的节点
 */
function createElement(tag, attrs, children) {
    // tag 标签名必传项
    if (typeof tag !== 'string') throw new Error('tag 参数类型必须是 字符串')
    // 创建制定标签的DOM节点
    let element = document.createElement(tag)
    // 判断DOM节点标签名是否合法
    if (element instanceof HTMLUnknownElement) throw new Error('tag 标签名不合法')
    // 接着判断传入的属性值
    if (typeOf(attrs) !== 'object') {
        attrs = {}
    }
    console.log(Object.entries(attrs));
    Object.entries(attrs).forEach(function (attr) {
        let attrName = attr[0]
        let attrValue = attr[1]
        let tempStr = ''
        // 如果style等属性是以对象的形式传入的
        if (typeOf(attr[1]) === 'object') {
            Object.entries(attr[1]).forEach(function (ele) {
                return tempStr += ele[0] + ':' + ele[1] + ';'
            })
            // console.log(tempStr);
            attrValue = tempStr
        }
        element[attrName] = attrValue
    })
    // 检测传入的子节点是否为字符串类型
    if (typeof children === 'string') {
        element.innerText = children
    }
    return element
}


let res1 = createElement('div', {
    className: 'abc', id: 'hh', style: {
        width: '190px',
        height: '80px'
    }
}, 'ABC1')
let res2 = createElement('div', {
    className: 'abc', id: 'hh', style: 'width: 190px;height: 80px;background:red;'
}, 'ABC1')
console.log(res1);
console.log(res2);

function initScroll(element) {
    let scrollDiatance = 0
    let distanceX = 0;
    element.addEventListener('touchstart', function (event) {
        function moveCallBack(e) {
            // 这两次 toucch 之间的距离
            distanceX = e.touches[0].clientX - event.touches[0].clientX
            element.style.transform = `translate3d(${scrollDiatance + distanceX}px,0,0)`
        };
        document.addEventListener('touchmove', moveCallBack)

        document.addEventListener('touchend', function () {
            // 叠加上次滑动的距离+清除 distanceX
            scrollDiatance += distanceX;
            distanceX = 0;
        })
    })
}
/**
 * @description: 初始化tab栏
 * @param {*} el 传入的dom节点
 * @param {*} config 配置项
 * @return {*}
 */
function initTabs(el, config) {
    // 检测传入的 dom 
    let root = null
    if (el instanceof HTMLElement) {
        root = el
    } else if (typeOf(el) === 'string') {
        root = document.querySelector(el)
    }
    if (!root) throw new Error('传入的dom不合法')

    //tab 栏滑动的逻辑
    initScroll(element);


}