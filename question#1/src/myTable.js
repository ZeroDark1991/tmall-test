const uuidv1 = require('uuid/v1')
const EventCollector = require('./eventCollector.js')
const { isObject, isDomNode, isArray, isDef, isUndef } = require('./utils.js')

const eventCollector = new EventCollector()
/**
 * MyTable Class
 * @constructor
 * @param {Object} config
 * @param {Object []} config.data 表格数据
 *
 * @param {Object []} config.head 表头数据
 *    @param {string} config.head[].key 表头数据项中的key对应 config.data[]的属性名
 *    @param {string} config.head[].label 表头数据项的名称
 *
 * @param {Object []} config.actions
 *    @param {string} config.actions[].text 操作栏的按钮名称
 *    @param {function} config.actions[].trigger 操作按钮点击时触发的callback
 *    @param {Object} config.actions[].events 对应row下各个cell绑定的事件
 *
 * @param {string= | domNode} config.container 表格的容器，默认值为document.body
 */
class MyTable {
	constructor(config) {
		const { data, actions, container, head } = config

		this.data = data
		this.head = head
		this.actions = actions
		this.namespace = uuidv1()
		this.container = container || document.body
    this.$element = null

		this.initialize()
	}

	initialize() {
		if(!isArray(this.data)) {
			throw new Error('TypeError:\n parameter of MyTable must be an Object and contains a data array')
			return
		}

		this.container = this.containerValidationCheck()
		if(isUndef(this.container)) { return }

    let fragment = document.createDocumentFragment()

    // table head
    if(this.head) {
      let tableHead = this.generateTableHead()
      fragment.appendChild(tableHead)
    }

    // table body
    let tableBody = this.generateTableBody()

    fragment.appendChild(tableBody)
    let tableContainer = createElementWithClass('div')
    tableContainer.setAttribute('id', `table_${this.namespace}`)
    tableContainer.appendChild(fragment)
    this.container.innerHTML = ''
    this.container.appendChild(tableContainer)
    eventCollector.flush()
    this.$element = tableContainer
	}

  // 生成表头
  generateTableHead() {
    let tableHead = createElementWithClass('div', 'table__head')
    if(!isArray(this.head)) {
      throw new Error('TypeError:\n head of config must be an Array')
      return
    }
    let headRowFragment = document.createDocumentFragment()
    this.head.forEach(headItem => {
      if(isObject(headItem) && isDef(headItem.label) && isDef(headItem)) {
        let column = createElementWithClass('div', 'table__column')
        column.textContent = headItem.label
        headRowFragment.appendChild(column)
      } else {
        throw new Error('TypeError:\n head of config must be an Object List')
        return
      }
    })

    if(isDef(this.actions) && isArray(this.actions)) {
      let column = createElementWithClass('div', 'table__column')
      column.textContent = '操作'
      headRowFragment.appendChild(column)
    }

    let tableHeadRow = createElementWithClass('div', 'table__row')
    tableHeadRow.appendChild(headRowFragment)
    tableHead.appendChild(tableHeadRow)

    return tableHead
  }

  // 生成表格主体
  generateTableBody() {
    let tableBody = createElementWithClass('div', 'table__body')
    let loadingMask = createElementWithClass('div', 'loading-mask')
    loadingMask.textContent = 'loading...'
    tableBody.appendChild(loadingMask)
    let dataLen = this.data.length
    for(let i = 0; i < dataLen; i++) {
      let target = this.data[i]
      let row = createElementWithClass('div', 'table__row')
      row.setAttribute('data-row-index', i)
      let rowFrag = document.createDocumentFragment()

      Object.keys(target).forEach((key, j) => {
        let label = this.head[j].key
        let column = createElementWithClass('div', 'table__column')
        column.setAttribute('data-column-label', label)
        column.textContent = target[key]
        rowFrag.appendChild(column)

        if(isDef(this.actions) && isArray(this.actions)) {
          this.actions.forEach(action => {
            let events = action.events
            if(isUndef(events)) { return }

            Object.keys(events).forEach(eventKey => {
              let event = events[eventKey]
              if(isArray(event.namespace)) {
                event.namespace.forEach(space => {
                  if(space === label) {
                    eventCollector.collect(eventKey, column, column, function() {
                      event.handler(this, { key, index: i })
                    })
                  }
                })
              }
            })

          })
        }
      })

      if(isDef(this.actions) && isArray(this.actions)) {
        let column = this.generateActionButtons(row)
        rowFrag.appendChild(column)
      }

      row.appendChild(rowFrag)
      tableBody.appendChild(row)
    }

    return tableBody
  }

  // 生成操作按钮
  generateActionButtons(row) {
    let actions = this.actions
    let column = createElementWithClass('div', 'table__column', 'action')
    actions.forEach((action, index) => {
      let actionNode = createElementWithClass('div')
      actionNode.classList.add('button')
      actionNode.textContent = action.text
      eventCollector.collect('click', actionNode, row, function() {
        action.trigger(this)
      })

      // 分隔符
      if(index > 0) {
        let slashNode = createElementWithClass('div')
        slashNode.textContent = '/'
        column.appendChild(slashNode)
      }
      column.appendChild(actionNode)
    })

    return column
  }

  // 验证config.container字段是否合法
  containerValidationCheck() {
    if(typeof this.container === 'string') {
      let targetNode = document.querySelector(this.container)
      if(isDomNode(targetNode)) {
        return targetNode
      } else {
        throw new Error(`Error:\n container <${this.container}> does not exsit`)
        return null
      }
    } else if(isDomNode(this.container)) {
      return this.container
    } else {
      throw new Error('TypeError:\n container must be DomNode or String')
      return null
    }
  }

  // 重新装载表格
  reload(data) {
    if(isUndef(data)) { return }
    let cachedOldData = this.data
    try {
      this.data = data
      this.initialize()
    } catch(e) {
      this.data = cachedOldData
      console.error(e)
    }
  }

  updateRow() {}

  // 删除行
  removeRow(index) {
    this.data.splice(index, 1)
    let target = this.$element.querySelector(`[data-row-index="${index}"]`)
    target && target.remove()
  }

  // Loading开关
  setLoading(bool) {
    let loadingMask = this.$element.querySelector('.loading-mask')
    if(bool === true) {
      loadingMask.style.display = 'flex'
    } else {
      loadingMask.style.display = 'none'
    }
  }
}

function createElementWithClass(tag, ...args) {
  let node = document.createElement(tag)
  if(args) {
    node.classList.add(...args)
  }
  return node
}

export default MyTable
