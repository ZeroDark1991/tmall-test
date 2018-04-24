export default function fakeFetch() {
	return new Promise(function(resolve, reject) {
		setTimeout(() => {
			resolve()
		}, 600)
	})
}