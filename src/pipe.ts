type pipe = {
  <T1, R>(f1: (value: T1) => R): (value: T1) => R
  <T1, T2, R>(f1: (value: T1) => T2, f2: (value: T2) => R): (value: T1) => R
  <T1, T2, T3, R>(
    f1: (value: T1) => T2,
    f2: (value: T2) => T3,
    f3: (value: T3) => R
  ): (value: T1) => R
  <T1, T2, T3, T4, R>(
    f1: (value: T1) => T2,
    f2: (value: T2) => T3,
    f3: (value: T3) => T4,
    f4: (value: T4) => R
  ): (value: T1) => R
  <T1, T2, T3, T4, T5, R>(
    f1: (value: T1) => T2,
    f2: (value: T2) => T3,
    f3: (value: T3) => T4,
    f4: (value: T4) => T5,
    f5: (value: T5) => R
  ): (value: T1) => R
  <T extends any[], R>(...T): (value: any) => R
}

const pipe: pipe = (...functions) => value =>
  functions.reduce((prevValue, fn) => fn(prevValue), value)

export default pipe
