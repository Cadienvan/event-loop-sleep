'use strict'
const { test } = require('tap')
const sleep = require('..')

const givenSleep = 1000
const givenTimeout = 100

test('blocks event loop for given amount of milliseconds', ({ end, ok }) => {
  const now = Date.now()
  setTimeout(() => {
    const delta = Date.now() - now
    ok(
      delta < givenSleep + givenTimeout,
      'sleep blocked event loop for given amount of milliseconds'
    )
    end()
  }, 100)
  sleep(givenSleep)
})

if (typeof BigInt !== 'undefined') {
  test('allows ms to be supplied as a BigInt number', ({ ok, end }) => {
    const now = Date.now()
    setTimeout(() => {
      const delta = Date.now() - now
      ok(
        delta < givenSleep + givenTimeout,
        'sleep blocked event loop for given amount of milliseconds'
      )
      end()
    }, 100)
    sleep(BigInt(givenSleep)) // avoiding n notation as this will error on legacy node/browsers
  })
}

test('throws range error if ms less than 0', ({ throws, end }) => {
  throws(
    () => sleep(-1),
    RangeError(
      'sleep: ms must be a number that is greater than 0 but less than Infinity'
    )
  )
  end()
})

test('throws range error if ms is Infinity', ({ throws, end }) => {
  throws(
    () => sleep(Infinity),
    RangeError(
      'sleep: ms must be a number that is greater than 0 but less than Infinity'
    )
  )
  end()
})

test('throws range error if ms is not a number or bigint', ({
  throws,
  end
}) => {
  throws(() => sleep('Infinity'), TypeError('sleep: ms must be a number'))
  throws(() => sleep('foo'), TypeError('sleep: ms must be a number'))
  throws(() => sleep({ a: 1 }), TypeError('sleep: ms must be a number'))
  throws(() => sleep([1, 2, 3]), TypeError('sleep: ms must be a number'))
  end()
})
