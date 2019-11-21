import Component from '@ember/component';
import { inject as service } from '@ember/service'
import Pusher from 'pusher-js'

export default Component.extend({
  allUsers: [].map(user => {
    return user
  }),
  maps: service('maps'),

  init() {
    this._super(...arguments)
    let pusher = new Pusher('984dbb3c9efeb47bee19', {
      cluster: "us2",
      encrypted: true
    })

    let users = this.get('allUsers')
    const channel = pusher.subscribe('location')
    channel.bind('checkin', data => {
      if (users.length == 0) {
        users.pushObject(data.location)
      } else {
        const userIndex = this.userExists(users, data.location, 0)
        if (userIndex === false) {
          users.pushObject(data.location)
        } else {
          users[userIndex] = data.location
        }
      }
      this.get('maps').createMapElement(users)
    })
  },

  didInsertElement() {
    this._super(...arguments)
    this.getAdminLocation()
  },

  userExists(users, user,index) {
    if (index == user.length) {
      return false
    }
    if (users[index].userId === user.userId) {
      return index
    } else {
      return this.userExists(users, user, index + 1)
    }
  },

  getAdminLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        const adminLocation = { lat: latitude, lng: longitude }
        this.get('maps').createAdminMap(adminLocation)
      }, null, { enableHighAccuracy: true })
    }
  }
});
