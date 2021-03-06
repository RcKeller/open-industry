import React, { Component } from 'react'

import NavigationDrawer from 'react-md/lib/NavigationDrawers'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'

//  Initialize Firebase with re(act)-firebase
import Firebase from '../firebase'

class UI extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      cases: [],
      chat: [],
      user: false
    }
    this.auth = this.auth.bind(this)
    this.unauth = this.unauth.bind(this)
  }

  componentWillMount () {
    Firebase.syncState(`cases`, {
      context: this,
      state: 'cases',
      asArray: true
    })
    Firebase.syncState(`chat`, {
      context: this,
      state: 'chat'
      // asArray: true
    })
  }

  auth () {
    //  oAuth returns {user: {credentials: ..., user: {}}}, thus the user.user prop
    let authHandler = (error, user) => !error ? this.setState({user: user.user}) : console.log('Error', error)
    Firebase.authWithOAuthPopup('google', authHandler)
    // this.setState({user: user})
  }
  unauth () {
    Firebase.unauth()
    this.setState({user: false})
  }

  render () {
    return (
      <div>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />

        <NavigationDrawer
          navItems={[<Sidebar
            auth={this.auth} unauth={this.unauth}
            user={this.state.user} chat={this.state.chat}
          />]}
          mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
          tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
          desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
          toolbarTitle={<span>Open Industry | <em>case manager</em></span>}
          drawerTitle={<span className='md-text--theme-primary'>Messaging</span>}
        >
          <Dashboard />
        </NavigationDrawer>
      </div>
    )
  }

}

export default UI
