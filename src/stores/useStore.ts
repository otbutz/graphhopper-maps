import createVanilla from 'zustand/vanilla'

import create from 'zustand'
import { createPathDetailsSlice, PathDetailsSlice } from '@/stores/pathDetailsSlice'
import { createSettingsSlice, SettingsSlice } from '@/stores/settingsSlice'
import { createMapOptionsSlice, MapOptionsSlice } from '@/stores/mapOptionsSlice'

export type AppStoreState = PathDetailsSlice & SettingsSlice & MapOptionsSlice

// this is only exported for unit tests
export const createAppStore = () =>
    createVanilla<AppStoreState>((...a) => ({
        ...createPathDetailsSlice(...a),
        ...createSettingsSlice(...a),
        ...createMapOptionsSlice(...a),
    }))

// todo: not sure about the name yet, because there is also zustand/useStore...
export const store = createAppStore()

export const useStore = create(store)
