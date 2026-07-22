<template lang="pug" src="./index.pug" ></template>

<script>
import { Loader } from '@googlemaps/js-api-loader'
import Icon from '~/assets/icons/map-pin.svg'

/* eslint-disable */
export default {
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    mapLoading: true,
    useGoogleMap: false,
    googleMapsApiKey: '',
    mapImage: {
      src: 'https://d20dg8rmreapkm.cloudfront.net/contact/service-map.jpg',
      webp: 'https://d20dg8rmreapkm.cloudfront.net/contact/service-map.webp',
      alt: 'Air Tech Solutions service area map'
    }
  }),
  mounted () {
    if (!this.useGoogleMap || !this.googleMapsApiKey) {
      this.mapLoading = false
      return
    }

    const loadMap = new Loader ({
      apiKey: this.googleMapsApiKey
    })
    loadMap.load().then(()=> {
      this.createMap()
      this.addMarker()
      this.mapLoading = false
    })
  },
  methods: {
    createMap () {
      this.$map = new google.maps.Map(this.$refs.theMap, {
        center: {
          lat: Number(this.props.address.coordinates.latitude),
          lng: Number(this.props.address.coordinates.longitude)
        },
        zoom: 9,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: '876c2d412dd92ae2'
      })
    },
    addMarker () {
      const $marker = new google.maps.Marker({
        position: {
          lat: Number(this.props.address.coordinates.latitude),
          lng: Number(this.props.address.coordinates.longitude)
        },
        map: this.$map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(Icon),
          scaledSize: new google.maps.Size(32, 32)
        }
      })
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
