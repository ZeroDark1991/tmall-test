import 'normalize.css'
import './style.styl'
import fakeFetch from './fakeFetch.js'

import { data, head } from './data.js'
import MyTable from './myTable.js'

let editableKeys = ['name']

let table = new MyTable({
	container: '#app',
	data,
	head,
	actions: [
		{
			text: '编辑',
			trigger: function(scope) {
        editableKeys.forEach(key => {
          let target = scope.querySelector(`[data-column-label="${key}"]`)
          if(target) {
  					target.setAttribute('contenteditable', true)
            target.dataset.cachedData = target.textContent
  					target.focus()
  				}
        })
			},
			events: {
				blur: {
					namespace: editableKeys,
					handler: (column, { key, index }) => {
						column.setAttribute('contenteditable', false)
            if(column.textContent === column.dataset.cachedData) { return }
            let newContent = column.textContent
            table.data[index][key] = newContent
            table.setLoading(true)
            let requestData = table.data[index]
            console.log(requestData)
            fakeFetch()
              .then(() => {
                table.setLoading(false)
              })
              .catch(e => {
                console.log(e)
              })
					}
				}
			}
		},
		{
			text: '删除',
			trigger: function(scope) {
        console.log(1)
        let index = scope.dataset.rowIndex
        if(index) {
          table.setLoading(true)
          fakeFetch()
            .then(() => {
              table.removeRow(index)
              table.setLoading(false)
            })
            .catch(e => {
              console.log(e)
            })
        }
			}
		}
	]
})
