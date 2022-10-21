import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { setTranslation } from '@/translation/Translation'
import App from '@/App'
import { getApiInfoStore, getErrorStore, getQueryStore, getRouteStore, setStores } from '@/stores/Stores'
import Dispatcher from '@/stores/Dispatcher'
import RouteStore from '@/stores/RouteStore'
import ApiInfoStore from '@/stores/ApiInfoStore'
import QueryStore from '@/stores/QueryStore'
import ErrorStore from '@/stores/ErrorStore'
import NavBar from '@/NavBar'
import * as config from 'config'
import { getApi, setApi } from '@/api/Api'
import MapActionReceiver from '@/stores/MapActionReceiver'
import { store } from '@/stores/useStore'

const url = new URL(window.location.href)
const locale = url.searchParams.get('locale')
setTranslation(locale || navigator.language)

// use graphhopper api key from url or try using one from the config
const apiKey = url.searchParams.has('key') ? url.searchParams.get('key') : config.keys.graphhopper
setApi(config.api, apiKey || '')

const initialCustomModelStr = url.searchParams.get('custom_model')
const queryStore = new QueryStore(getApi(), initialCustomModelStr)
const routeStore = new RouteStore(queryStore)

setStores({
    queryStore: queryStore,
    routeStore: routeStore,
    infoStore: new ApiInfoStore(),
    errorStore: new ErrorStore(),
})

// register stores at dispatcher to receive actions
Dispatcher.register(getQueryStore())
Dispatcher.register(getRouteStore())
Dispatcher.register(getApiInfoStore())
Dispatcher.register(getErrorStore())

// register map action receiver
const smallScreenMediaQuery = window.matchMedia('(max-width: 44rem)')
const mapActionReceiver = new MapActionReceiver(store.getState().map, routeStore, () => smallScreenMediaQuery.matches)
Dispatcher.register(mapActionReceiver)

getApi().infoWithDispatch() // get infos about the api as soon as possible

// hook up the navbar to the query store and vice versa
const navBar = new NavBar(getQueryStore())
// parse the initial url
navBar.parseUrlAndReplaceQuery()

// create a div which holds the app and render the 'App' component
const rootDiv = document.createElement('div') as HTMLDivElement
rootDiv.id = 'root'
rootDiv.style.height = '100%'
document.body.appendChild(rootDiv)

const root = createRoot(rootDiv)
root.render(
    // <StrictMode>
    <App />
    // </StrictMode>
)
