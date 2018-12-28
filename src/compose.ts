type compose = {
  <T1, R>(f1: (value: T1) => R): (value: T1) => R
  <T1, T2, R>(f2: (value: T2) => R, f1: (value: T1) => T2): (value: T1) => R
  <T1, T2, T3, R>(
    f3: (value: T3) => R,
    f2: (value: T2) => T3,
    f1: (value: T1) => T2
  ): (value: T1) => R
  <T1, T2, T3, T4, R>(
    f4: (value: T4) => R,
    f3: (value: T3) => T4,
    f2: (value: T2) => T3,
    f1: (value: T1) => T2
  ): (value: T1) => R
  <T1, T2, T3, T4, T5, R>(
    f5: (value: T5) => R,
    f4: (value: T4) => T5,
    f3: (value: T3) => T4,
    f2: (value: T2) => T3,
    f1: (value: T1) => T2
  ): (value: T1) => R
  <T extends any[], R>(...T): (value: any) => R
}

const compose: compose = (...functions) => value =>
  functions.reduceRight((prevValue, fn) => fn(prevValue), value)

export default compose
