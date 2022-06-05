import { atom } from 'recoil'
import store from 'store'

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = store.get(key)
    if (savedValue != null) {
      setSelf(savedValue)
    }

    onSet((newValue: object) => {
      store.set(key, newValue)
    })
  }

export const geolocationState = atom({
  key: 'geolocationState',

  default: { lat: 37.5666805, lon: 126.9784147 },
  effects: [localStorageEffect('geolocation')],
})