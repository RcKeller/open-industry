import React from 'react'
import RefData from '../Data/RefData'

import Autocomplete from 'react-md/lib/Autocompletes'

var KEY_BACKSPACE = 8
var KEY_DELETE = 46
var KEY_F2 = 113

// cell renderer for the proficiency column. this is a very basic cell editor,
export default class SelectEditor extends React.Component {

  constructor (props) {
    super(props)
    // the entire ag-Grid properties are passed as one single object inside the params
    this.state = this.createInitialState(props)
    this.handleBlur = this.handleBlur.bind(this)
  }

  // work out how to present the data based on what the user hit. you don't need to do any of
  // this for your ag-Grid cellEditor to work, however it makes sense to do this so the user
  // experience is similar to Excel
  createInitialState (props) {
    var originalValue = props.value
    var startValue
    var putCursorAtEndOnFocus = false
    var highlightAllOnFocus = false

    if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE) {
      // if backspace or delete pressed, we clear the cell
      startValue = ''
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = props.charPress
    } else {
      // otherwise we start with the current value
      startValue = props.value
      if (props.keyPress === KEY_F2) {
        this.putCursorAtEndOnFocus = true
      } else {
        this.highlightAllOnFocus = true
      }
    }

    return {
      original: originalValue,
      value: startValue,
      putCursorAtEndOnFocus: putCursorAtEndOnFocus,
      highlightAllOnFocus: highlightAllOnFocus,

      options: ['1 - Critical', '2 - High', '3 - Medium', '4 - Low']

    }
  }

  handleBlur (e) {
    let value = e.target.value
    console.log(value)
    // let value = this.state.value
    if (!this.state.options.indexOf(value) > -1) {
      console.log('Reverting value')
      this.setState({value: this.state.original})
    } else {
      this.setState({value})
    }
  }

  componentWillUnmount () {
    let value = this.state.value
    if (!this.state.options.indexOf(value) > -1) {
      console.log('Reverting value on unmount')
      this.setState({value: this.state.original})
    }
  }

  render () {
    return (
      <Autocomplete
        id='select-editor'
        placeholder={this.state.original}
        // block paddedBlock={false}
        // autoFocus
        data={this.state.options}
        value={this.state.value}
        onChange={this.onChangeListener.bind(this)}
        onAutocomplete={this.onChangeListener.bind(this)}
        inline
        fullWidth
        onBlur={this.handleBlur}
        // required

        // lineDirection='center'
        // className='md-title--toolbar'
        // inputClassName='md-text-field--toolbar'
          />

      // <SelectField
      //   // id='selectButtonStates'
      //   placeholder={this.state.original}
      //   // placeholder='State'
      //   menuItems={['1', '2', '3', '4']}
      //   // itemLabel='abbreviation'
      //   // itemValue='abbreviation'
      //   position={SelectField.Positions.BELOW}
      //    value={this.state.value}
      //   onChange={this.onChangeListener.bind(this)}
      //   // className='md-cell'
      //   style={{zIndex: 100}}
      //   />
      // .
      // <input ref='textField' value={this.state.value} onChange={this.onChangeListener.bind(this)} />
    //   <TextField id='floatingCenterTitle' ref='textField'
    //     value={this.state.value}
    //     onChange={this.onChangeListener.bind(this)}
    //     label={<span>Editing {this.state.original && <em>: {this.state.original}</em>}</span>}
    //     lineDirection='center'
    // />
    )
  }

  onChangeListener (value) {
    // if doing React, you will probably be using a library for managing immutable
    // objects better. to keep this example simple, we don't use one.
    var newState = {
      value,
      putCursorAtEndOnFocus: this.state.putCursorAtEndOnFocus,
      highlightAllOnFocus: this.state.highlightAllOnFocus
    }
    this.setState(newState)
  }

  // called by ag-Grid, to get the final value
  getValue () {
    return this.state.value
  }

  // cannot use componentDidMount because although the component might be ready from React's point of
  // view, it may not yet be in the browser (put in by ag-Grid) so focus will not work
  afterGuiAttached () {
    // get ref from React component
    var eInput = document.getElementById('select-editor')

    eInput.focus()
    if (this.highlightAllOnFocus) {
      // eInput.select()
      eInput.focus()
    } else {
      // when we started editing, we want the carot at the end, not the start.
      // this comes into play in two scenarios: a) when user hits F2 and b)
      // when user hits a printable character, then on IE (and only IE) the carot
      // was placed after the first character, thus 'apply' would end up as 'pplea'
      var length = eInput.value ? eInput.value.length : 0
      if (length > 0) {
        eInput.setSelectionRange(length, length)
      }
    }
  }

  // if we want the editor to appear in a popup, then return true.
  isPopup () {
    return false
  }

  // return true here if you don't want to allow editing on the cell.
  isCancelBeforeStart () {
    return false
  }

  // just to demonstrate, if you type in 'cancel' then the edit will not take effect
  isCancelAfterEnd () {
    if (this.state.value && this.state.value.toUpperCase() === 'CANCEL') {
      return true
    } else {
      return false
    }
  }
}

// the grid will always pass in one props called 'params',
// which is the grid passing you the params for the cellRenderer.
// this piece is optional. the grid will always pass the 'params'
// props, so little need for adding this validation meta-data.
SelectEditor.propTypes = {
  params: React.PropTypes.object
}