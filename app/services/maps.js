import Service from '@ember/service';
import $ from 'jquery'

const google = window.google
let targetLocation
const rangeRadius = 500

export default Service.extend({
  createAdminMap(adminLocation) {
    targetLocation = adminLocation
    this.createMapElement([])
  },

  createMapElement(userLocation) {
    const element = document.querySelector("#map")
    let map = new google.maps.Map(element, { zoom: 16, center: targetLocation })

    this.addMarker(targetLocation, map)
    userLocation.forEach(location => {
      this.addMarker(location, map, true)
    })

    new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      map: map,
      center: targetLocation,
      radius: rangeRadius
    })
  },

  addMarker(userLocation, map, icon = false) {
    if (icon) {
      icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    } else {
      icon = ""
    }

    let parsedUserLocation = {
      lat: parseFloat(userLocation.lat),
      lng: parseFloat(userLocation.lng),
      name: parseFloat(userLocation.name),
      userId: parseFloat(userLocation.userId)
    }

    new google.maps.Marker({ position: parsedUserLocation, map, icon })
    this.addUserWithinRange(parsedUserLocation)
  },

  addUserWithinRange(userLocation) {
    if (userLocation.name) {
      let userDistance = this.locationDistance(userLocation)
      let existingUser = $('div').find(`[data-id="${userLocation.userId}"]`)
      if (userDistance < rangeRadius) {
        if (!existingUser[0]) {
          let div = document.createElement('div')
          div.className = 'available-user'
          div.dataset.id = userLocation.userId
          let span = document.createElement('span')
          span.className = 'text-white'
          let username = `@${userLocation.name}`
          span.append(username)
          div.append(span)
          const usersDiv = document.querySelector('.users')
          usersDiv.append(div)
        }
      } else {
        existingUser.remove()
      }
    }
  },

  locationDistance(userLocation) {
    const point1 = new google.maps.LatLng(targetLocation.lat, targetLocation.lng)
    const point2 = new google.maps.LatLng(userLocation.lat, userLocation.lng)
    const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2)
    return distance
  }
});
