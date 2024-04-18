import { createId } from '../../src/utils/create-id'

describe('utils/create-id', () => {
  it('should generate a prefixed id', () => {
    const id = createId('jest')

    expect(id).toHaveLength(29)
    expect(id.includes('jest_')).toEqual(true)
  })

  it('should generate a prefixed id with a given length', () => {
    const id = createId('jest', 5)

    expect(id).toHaveLength(10)
    expect(id.includes('jest_')).toEqual(true)
  })
})
