// 算法复杂度O(n^2)
function foobar (s) {
  if(typeof s !== 'string') { return }

  let pool = [], maxLen = 0, currentLength = 0
  for(let i = 0; i < s.length; i++) {
    if(checkValid(s, i - currentLength - 1, i)){
      currentLength = maxLen = currentLength + 2
    }
    else if(checkValid(s, i - currentLength, i)){
      currentLength = maxLen = currentLength + 1
    }
  }

  for(let i = 0; i <= s.length - maxLen; i++) {
  	if(checkValid(s, i, i + maxLen - 1)) {
  		let str = s.substring(i, i + maxLen)
  		if(str.length !== 0) pool.push(str)
  	}
  }

  function checkValid(s, begin, end){
    if(begin < 0) return false
    while(begin < end){
    	if(s.charAt(begin++) != s.charAt(end--)) return false
    }
    return true
  }

  return pool
}

Array.prototype.equal = function (arr) {
  let pass = JSON.stringify(this) === JSON.stringify(arr)
  if (pass) {
    console.info('passed')
  } else {
    console.error('failed')
  }
}

foobar('12').equal(['1', '2'])
foobar('22').equal(['22'])
foobar('1').equal(['1'])
foobar('12').equal(['1', '2'])
foobar('').equal([])
foobar('aa123321bb').equal(['123321'])
foobar('12134abcd').equal(['121'])
foobar('rewqujdsaafjkdfdasad').equal(['dasad'])
foobar('babad').equal(['bab', 'aba'])
foobar('cbbd').equal(['bb'])