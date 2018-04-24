module.exports = class EventCollector {
	constructor() {
		this.list = []
	}

	collect(type, node, scope, handler) {
		this.list.push({ type, node, scope, handler })
	}

	flush() {
		this.list.forEach(({ type, node, scope, handler }) => {
			node.addEventListener(type, handler.bind(scope))
		})
		this.clean()
	}

	clean() {
		this.list = []
	}
}
