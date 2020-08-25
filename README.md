# useKMF

**Kiss My Form** is probably the most simple yet powerfull react form helper out there.

150 lines of code, that everyone can understan, are enough to enhance your developer experience, and also the performance of your webapplications when it comes to deal with forms.

## Examples

### Basic

```javascript
import useKMF from 'useKMF'

exports default SomeFormComponent ({ onSubmit }) {
  const { inputControl, handleSubmit } = useKMF()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...inputControl('username')} />
      <input {...inputControl('password')} type="password" />
      <button> Login </button>
    </form>
  )
}
```

### With Validation

```javascript
import useKMF from 'useKMF'

function beforeChange ({ name, value, errors }) {
  if (!name) return

  switch(name) {
    case 'username':
      if (value.length < 3) {
        errors.username = 'Username must have at least 3 characters'
        return
      }
      if (!value.match(/^[\w]*$/)) {
        errors.username = 'Username must have at least 3 characters'
        return
      }
      break
    case 'password':
      if (value.length < 8) {
        errors.password = 'Password must have at least 8 characters'
        return
      }
  }
}

exports default SomeFormComponent ({ onSubmit }) {
  const { inputControl, handleSubmit, state: { errors, hasErrors } } = useKMF()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...inputControl('username')} />
      <input {...inputControl('password')} type="password" />
      <button disabled={Boolean(hasErrors)}> Login </button>
    </form>
  )
}

```

## API overview

### useKMF (options) => helpers

React hook that returns a buch of helpers to manage the form

### options

* `afterChange(state)` function that is called each after the form state is updated
* `beforeChange({ name, value, values, errors })` function that is called before the form state is updated. `values`and `errors` can be mutated to change the update.
* `initialValues`: object with the initial values of the form

### helpers

* `checkboxControl(name)`: sintactic sugar for `name={name} value={getValue(name)} onChange={setChecked}`
* `dispatch(newState)`: Updates the form state, computing `isDirty` and `hasErrors`, and calling `afterChange`
* `getValue(name)`: returns the value of the form element whose name is `name`
* `handleSubmit(callback)`: it calls `callback` when the form is submitted if there is no errors.
* `inputControl(name)`:  sintactic sugar for `name={name} value={getValue(name)} onChange={setInput}`
* `setChecked`: handler for the `onChange` events of checkboxes that updates the state of the form.
* `setInput`:  handler for the `onChange` events of inputs, textareas and selects that updates the state of the form.
* `setValue(name, value)`: calls `beforeUpdate` and then updates the state of the form.
* `state`: the state of the form `{ afterChange, initialValues, errors, hasErrors, isDirty, values }`


## Reference

### `useKMF`
```javascript
 const { inputControl, handleSubmit } = useKMF()
```
`useKMF` is a react hook, it should be used like all the react hooks: it cannot be called conditionally and it only be called from inside components or hooks.


### `afterChange(state) => undefined`
```javascript
 const { inputControl, handleSubmit } = useKMF({ afterChange })
```

It is called after any update of the form's state with the state as parameter.

Your component is supposed to be organized around reactivity, so everytime the you component funcion is called again, you check the state values and act accordingly. Buy you might want to pass an event handler from the component's parent. So it can change its state when the form has errors for instance. `afterChange` is meant for this.

### `beforeChange({ name, value, values, errors }) => undefined`
```javascript
 const { inputControl, handleSubmit } = useKMF({ beforeChange })
```
It is called before any update of the form's state with the state as parameter.

You can use it to validate or transform the change.


Your component is supposed to be organized around reactivity, so everytime the you component funcion is called again, you check the state values and act accordingly. Buy you might want to pass an event handler from the component's parent. So it can change its state when the form has errors for instance. `afterChange` is meant for this.

### `initialValues`
`initialValues` is one of the optional parameters that can be passed to `useKMF`

It establishs the form's initial values at initialization time.

After form's initializaton, any change of `initialValues` could reload the component, but won't change its current values.
